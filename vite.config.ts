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
      // Páginas: a LP, o obrigado, a política de privacidade e o painel de inscrições (/protocolo-10k/<pasta>/)
      input: {
        main: path.resolve(import.meta.dirname, 'index.html'),
        obrigado: path.resolve(import.meta.dirname, 'obrigado/index.html'),
        privacidade: path.resolve(import.meta.dirname, 'politica-de-privacidade/index.html'),
        dash: path.resolve(import.meta.dirname, 'dash/index.html'),
      },
    },
  },
  // API local (cd api && npm run dev). Em produção o Traefik manda /protocolo-10k/api direto para a API,
  // removendo /protocolo-10k e informando-o em X-Forwarded-Prefix (Path do cookie de sessão) — aqui imita isso.
  server: {
    proxy: {
      '/protocolo-10k/api': {
        target: 'http://localhost:3001',
        rewrite: (p) => p.replace(/^\/protocolo-10k/, ''),
        headers: { 'X-Forwarded-Prefix': '/protocolo-10k' },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
