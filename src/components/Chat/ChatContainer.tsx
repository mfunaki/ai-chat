"use client";

import { useState, useCallback } from "react";
import { MessageList, MessageType } from "./MessageList";
import { MessageInput } from "./MessageInput";

export function ChatContainer() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = useCallback(async (message: string) => {
    setError(null);
    setIsLoading(true);

    // ユーザーメッセージを追加
    const userMessage: MessageType = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("チャットAPIでエラーが発生しました");
      }

      // ストリーミングレスポンスを処理
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("レスポンスの読み取りに失敗しました");
      }

      const decoder = new TextDecoder();
      let assistantContent = "";

      // アシスタントメッセージのプレースホルダーを追加
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;

        // 最後のメッセージ（アシスタント）を更新
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: "assistant",
            content: assistantContent,
          };
          return newMessages;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      // エラー時はユーザーメッセージを削除
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} isLoading={isLoading && messages[messages.length - 1]?.role === "user"} />
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      <MessageInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
