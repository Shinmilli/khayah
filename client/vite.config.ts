import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** 개발 서버·프록시 대상은 고정(환경변수는 `VITE_API_BASE`만 사용) */
const DEV_PORT = 5173
const DEV_API_PROXY_TARGET = 'http://localhost:3001'

export default defineConfig({
  plugins: [react()],
  server: {
    port: DEV_PORT,
    proxy: {
      '/api': {
        target: DEV_API_PROXY_TARGET,
        changeOrigin: true,
        // 대용량 PDF(Supabase) 업로드가 프록시에서 끊기지 않도록
        timeout: 10 * 60 * 1000,
        proxyTimeout: 10 * 60 * 1000,
      },
      '/uploads': {
        target: DEV_API_PROXY_TARGET,
        changeOrigin: true,
        timeout: 10 * 60 * 1000,
        proxyTimeout: 10 * 60 * 1000,
      },
    },
  },
})
