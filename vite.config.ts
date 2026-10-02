import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Publicado em https://dr.gustavosa.com.br/protocolo-10k — todos os caminhos partem dessa subpasta
export default defineConfig({
  base: '/protocolo-10k/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
