import { Hono } from "hono";
import { handle } from "hono/vercel";
import { streamText } from "hono/streaming";
import { rateLimiter } from "hono-rate-limiter";
import { chatAgent } from "@/lib/mastra/agent";

export const runtime = "nodejs";

// 定数設定
const MAX_MESSAGE_LENGTH = 4000; // メッセージの最大文字数
const MAX_HISTORY_LENGTH = 50; // 会話履歴の最大件数
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1分間
const RATE_LIMIT_MAX_REQUESTS = 20; // 1分間に20リクエストまで

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequest = {
  message: string;
  history: Message[];
};

const app = new Hono().basePath("/api");

// レート制限ミドルウェア（/api/chat のみ適用）
const limiter = rateLimiter({
  windowMs: RATE_LIMIT_WINDOW_MS,
  limit: RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: "draft-6",
  keyGenerator: (c) => {
    // X-Forwarded-For または X-Real-IP からクライアントIPを取得
    const forwarded = c.req.header("x-forwarded-for");
    const realIp = c.req.header("x-real-ip");
    return forwarded?.split(",")[0]?.trim() || realIp || "unknown";
  },
  handler: (c) => {
    return c.json(
      { error: "リクエストが多すぎます。しばらく待ってから再度お試しください。" },
      429
    );
  },
});

app.post("/chat", limiter, async (c) => {
  try {
    const body = await c.req.json<ChatRequest>();
    const { message, history } = body;

    // 入力バリデーション
    if (!message || typeof message !== "string") {
      return c.json({ error: "メッセージが入力されていません" }, 400);
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return c.json({ error: "メッセージが空です" }, 400);
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return c.json(
        { error: `メッセージは${MAX_MESSAGE_LENGTH}文字以内で入力してください` },
        400
      );
    }

    // 会話履歴のバリデーション
    if (!Array.isArray(history)) {
      return c.json({ error: "会話履歴の形式が不正です" }, 400);
    }

    // 会話履歴の上限を超えた場合は切り詰め（最新のものを残す）
    const limitedHistory = history.slice(-MAX_HISTORY_LENGTH);

    // 会話履歴をコンテキストとして含めたプロンプトを作成
    let contextPrompt = "";
    if (limitedHistory.length > 0) {
      contextPrompt = "これまでの会話:\n";
      for (const msg of limitedHistory) {
        const role = msg.role === "user" ? "ユーザー" : "アシスタント";
        contextPrompt += `${role}: ${msg.content}\n`;
      }
      contextPrompt += "\n現在のユーザーの質問:\n";
    }

    const fullPrompt = contextPrompt + trimmedMessage;

    // タイムアウト付きでストリーミング開始
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 60000); // 60秒タイムアウト

    try {
      const stream = await chatAgent.stream(fullPrompt);

      return streamText(c, async (textStream) => {
        try {
          for await (const chunk of stream.textStream) {
            if (controller.signal.aborted) {
              break;
            }
            await textStream.write(chunk);
          }
        } finally {
          clearTimeout(timeoutId);
        }
      });
    } catch (streamError) {
      clearTimeout(timeoutId);
      if (controller.signal.aborted) {
        return c.json({ error: "リクエストがタイムアウトしました" }, 504);
      }
      throw streamError;
    }
  } catch (error) {
    console.error("Chat API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // APIキーエラーの場合は分かりやすいメッセージを返す
    if (errorMessage.includes("invalid x-api-key") || errorMessage.includes("authentication")) {
      return c.json({ error: "APIキーが設定されていないか無効です" }, 401);
    }

    return c.json({ error: "チャットの処理中にエラーが発生しました" }, 500);
  }
});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

export const GET = handle(app);
export const POST = handle(app);
