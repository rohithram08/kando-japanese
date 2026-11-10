import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'
import './App.css'
import { useThemeStore } from './store/themeStore'
import { useSettingsStore } from './store/settingsStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    }
  }
})

// Purge any stale legacy Supabase session artifacts from browser localStorage
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('sb-') || key.includes('supabase')) {
        localStorage.removeItem(key);
      }
    });
  } catch {
    // Ignore storage access errors
  }
}

// Initialize theme before render to prevent flash
useThemeStore.getState().initTheme()
// Apply persisted settings (animations, compact mode, font size) before render
useSettingsStore.getState().init()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3400,
            className: 'kando-modern-toast',
            style: {
              borderRadius: '16px',
              background: 'hsl(var(--surface) / 0.92)',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border) / 0.85)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              fontSize: '13.5px',
              fontWeight: '600',
              padding: '12px 18px',
              boxShadow: '0 16px 38px -6px rgba(0, 0, 0, 0.22), 0 4px 12px rgba(0, 0, 0, 0.06)',
              letterSpacing: '-0.01em',
            },
            success: {
              duration: 3200,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#ffffff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)