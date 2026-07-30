"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error-boundary]", error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body>
        <main className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-4 bg-surface border border-border rounded-xl p-6">
            <h1 className="text-lg font-semibold text-text-primary">
              حدث خطأ غير متوقع / Something went wrong
            </h1>
            <p className="text-sm text-text-secondary">
              يرجى إعادة المحاولة / Please try again.
            </p>
            <button
              onClick={() => reset()}
              className="bg-accent text-white rounded-md px-4 py-2 font-medium"
            >
              إعادة المحاولة / Retry
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
