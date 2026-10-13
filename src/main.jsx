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
            duration: 3000,
            style: {
              borderRadius: '12px',
              background: '#1f2937',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            },
            success: {
              iconTheme: {
                primary: '#4ade80',
                secondary: '#1f2937',
              },
            },
            error: {
              iconTheme: {
                primary: '#f87171',
                secondary: '#1f2937',
              },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)