"use client";

type MessageProps = {
  role: "user" | "assistant";
  content: string;
};

export function Message({ role, content }: MessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 animate-fade-in`}
    >
      <div className={`flex items-start gap-3 max-w-[85%] md:max-w-[75%] ${isUser ? "flex-row-reverse" : ""}`}>
        {/* アバター */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
            isUser
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {isUser ? "You" : "AI"}
        </div>
        {/* メッセージ本文 */}
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            isUser
              ? "bg-blue-600 text-white rounded-tr-sm"
              : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</p>
        </div>
      </div>
    </div>
  );
}
