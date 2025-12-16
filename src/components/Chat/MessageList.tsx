"use client";

import { useEffect, useRef } from "react";
import { Message } from "./Message";

export type MessageType = {
  role: "user" | "assistant";
  content: string;
};

type MessageListProps = {
  messages: MessageType[];
  isLoading?: boolean;
};

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-500">会話を始めましょう</p>
            <p className="text-sm text-gray-400 mt-1">下のテキストボックスにメッセージを入力してください</p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <Message key={index} role={message.role} content={message.content} />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                  AI
                </div>
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
