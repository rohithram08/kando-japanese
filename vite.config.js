import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Dev-proxy target comes from env (VITE_DEV_API_TARGET) instead of a baked-in port.
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_DEV_API_TARGET || 'http://localhost:3001'
  const devPort = Number(env.VITE_DEV_PORT) || 3000

  return {
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages':      path.resolve(__dirname, './src/pages'),
      '@store':      path.resolve(__dirname, './src/store'),
      '@hooks':      path.resolve(__dirname, './src/hooks'),
      '@data':       path.resolve(__dirname, './src/data'),
      '@utils':      path.resolve(__dirname, './src/utils'),
      '@assets':     path.resolve(__dirname, './src/assets'),
    },
  },

  server: {
    port: devPort,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
      },
      // Uploaded avatars were being requested from the Vite server itself
      // (→ index.html → broken image). Forward legacy "/storage/…" URLs too.
      '/storage': {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react:   ['react', 'react-dom'],
          router:  ['react-router-dom'],
          query:   ['@tanstack/react-query'],
          zustand: ['zustand'],
          three:   ['three', '@pixiv/three-vrm'],
          charts:  ['recharts'],
        },
      },
    },
  },
}
})
