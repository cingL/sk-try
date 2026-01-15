import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { copyFileSync } from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Plugin to copy index.html to 404.html for GitHub Pages SPA routing
    {
      name: 'copy-404',
      closeBundle() {
        const basePath = process.env.VITE_BASE_PATH || '/'
        const distPath = path.resolve(__dirname, 'dist')
        try {
          copyFileSync(
            path.join(distPath, 'index.html'),
            path.join(distPath, '404.html')
          )
          console.log('✓ Copied index.html to 404.html for GitHub Pages')
        } catch (err) {
          console.warn('Failed to copy 404.html:', err)
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  // GitHub Pages 部署配置
  // 如果仓库不在根目录（如 https://username.github.io/repo-name/），
  // 需要设置 base 为 '/repo-name/'
  // 如果部署到自定义域名或根目录，可以注释掉或设置为 '/'
  base: process.env.VITE_BASE_PATH || '/',
})
