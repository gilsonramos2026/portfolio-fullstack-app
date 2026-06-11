import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  server: {
    port: 3000, // Definição de porta padrão para consistência
    open: true,  // Abre o navegador automaticamente ao iniciar
  },
  resolve: {
    alias: {
      '@': '/src', // Opcional: permite importar como "@/components/..."
    },
  },
})