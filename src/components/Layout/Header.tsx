"use client";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">mabl-aichat</h1>
        <span className="text-sm text-gray-500">AI Chat Assistant</span>
      </div>
    </header>
  );
}
