"use client";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm flex-shrink-0">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-lg md:text-xl font-semibold text-gray-800">mabl-aichat</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
            Powered by Claude
          </span>
        </div>
      </div>
    </header>
  );
}
