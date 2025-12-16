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

  const handleDismissError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} isLoading={isLoading && messages[messages.length - 1]?.role === "user"} />
      {error && (
        <div className="px-4 py-3 bg-red-50 border-t border-red-200 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button
            onClick={handleDismissError}
            className="text-red-400 hover:text-red-600 transition-colors"
            aria-label="閉じる"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <MessageInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
