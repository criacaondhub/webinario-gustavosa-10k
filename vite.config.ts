import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Publicado em https://dr.gustavosa.com.br/protocolo-10k — todos os caminhos partem dessa subpasta
export default defineConfig({
  base: '/protocolo-10k/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // Duas páginas: a LP e a página de obrigado (/protocolo-10k/obrigado/)
      input: {
        main: path.resolve(import.meta.dirname, 'index.html'),
        obrigado: path.resolve(import.meta.dirname, 'obrigado/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
