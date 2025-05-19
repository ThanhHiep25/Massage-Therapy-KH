import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend Spring Boot
        changeOrigin: true,
        secure: false,
      },
    },
  },
  css: {
    postcss: './postcss.config.js', // Kiểm tra xem postcss có được chỉ định đúng không
  },
})
