import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente baseadas no modo atual (development ou production)
  const env = loadEnv(mode, process.cwd(), "");

  // Define a URL do backend baseada na variável ou usa o localhost como fallback seguro
  const backendUrl = env.VITE_API_URL || "http://localhost:8080";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Injeta a variável globalmente para o código se você precisar usar import.meta.env.VITE_API_URL
    define: {
      "process.env.VITE_API_URL": JSON.stringify(backendUrl),
    },
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
