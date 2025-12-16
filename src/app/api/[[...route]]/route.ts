import { Hono } from "hono";
import { handle } from "hono/vercel";
import { streamText } from "hono/streaming";
import { chatAgent } from "@/lib/mastra/agent";

export const runtime = "nodejs";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequest = {
  message: string;
  history: Message[];
};

const app = new Hono().basePath("/api");

app.post("/chat", async (c) => {
  try {
    const { message, history } = await c.req.json<ChatRequest>();

    // 会話履歴をコンテキストとして含めたプロンプトを作成
    let contextPrompt = "";
    if (history.length > 0) {
      contextPrompt = "これまでの会話:\n";
      for (const msg of history) {
        const role = msg.role === "user" ? "ユーザー" : "アシスタント";
        contextPrompt += `${role}: ${msg.content}\n`;
      }
      contextPrompt += "\n現在のユーザーの質問:\n";
    }

    const fullPrompt = contextPrompt + message;
    const stream = await chatAgent.stream(fullPrompt);

    return streamText(c, async (textStream) => {
      for await (const chunk of stream.textStream) {
        await textStream.write(chunk);
      }
    });
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
