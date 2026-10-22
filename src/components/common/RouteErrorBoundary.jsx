// src/components/common/RouteErrorBoundary.jsx
import React from 'react'
import { AlertTriangle, RefreshCw, Home, BookOpen } from 'lucide-react'

export function RouteErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div
      role="alert"
      className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto"
    >
      <div className="w-14 h-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h2 className="text-xl font-bold text-foreground mb-2">
        Unable to Load Page
      </h2>

      <p className="text-sm text-muted-foreground mb-6">
        {error?.message?.includes('dynamically imported') || error?.message?.includes('fetch')
          ? 'A network hiccup interrupted loading this section. Please check your connection and try again.'
          : 'An unexpected issue occurred while rendering this page.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              try {
                Object.keys(sessionStorage)
                  .filter((k) => k.startsWith('chunk_retry_'))
                  .forEach((k) => sessionStorage.removeItem(k));
              } catch (_) {}
            }
            if (typeof resetErrorBoundary === 'function') {
              resetErrorBoundary();
            } else {
              window.location.reload();
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>

        <a
          href="/reading"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-foreground text-sm font-semibold hover:bg-muted/80 transition-all active:scale-95 border border-border"
        >
          <BookOpen className="w-4 h-4" />
          Graded Readers
        </a>

        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-foreground text-sm font-semibold hover:bg-muted/80 transition-all active:scale-95 border border-border"
        >
          <Home className="w-4 h-4" />
          Dashboard
        </a>
      </div>
    </div>
  )
}

export function RouteLoadingFallback({ message = 'Loading...' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-[350px] flex flex-col items-center justify-center p-8 gap-3"
    >
      <div className="w-10 h-10 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
      <p className="text-xs font-medium text-muted-foreground tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  )
}
