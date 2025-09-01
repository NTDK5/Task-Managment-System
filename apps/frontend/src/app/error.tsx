'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-6">
        <h1 className="text-6xl font-bold text-red-600 mb-4">⚠️</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Development)
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-800 overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        
        <div className="space-x-4">
          <button
            onClick={reset}
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
