import axios, { AxiosError } from "axios";
import type { ApiErrorResponse } from "../types/api";

export const ADMIN_TOKEN_STORAGE_KEY = "portfolio.admin.token";

// Utiliza a variável de ambiente do Vite ou cai na URL exata do Railway
const baseURL = import.meta.env.VITE_API_URL || "https://portfolio-fullstack-app-production-8016.up.railway.app";

export const apiClient = axios.create({
  baseURL,
  timeout: 30000, // Mantido 30 segundos para evitar timeout com o banco do Railway
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor de request: injeta o token administrativo (X-Admin-Token)
 * em toda chamada, sempre que existir uma sessão salva no navegador.
 */
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
  if (token) {
    config.headers["X-Admin-Token"] = token;
  }
  return config;
});

/** Erro de aplicação normalizado, usado pela UI para exibir mensagens. */
export class AppError extends Error {
  status?: number;
  validationErrors?: Record<string, string>;

  constructor(message: string, status?: number, validationErrors?: Record<string, string>) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.validationErrors = validationErrors;
  }
}

/**
 * Interceptor de response: converte erros do Axios/backend em AppError,
 * e dispara um evento global quando o token admin é rejeitado (401).
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401) {
      window.dispatchEvent(new CustomEvent("admin-unauthorized"));
    }

    const message =
      data?.message ??
      (error.code === "ECONNABORTED"
        ? "Tempo de resposta excedido. Verifique se a API está no ar."
        : "Não foi possível completar a requisição.");

    const validationErrors: Record<string, string> = {};
    for (const detail of data?.details ?? []) {
      const [field, ...rest] = detail.split(":");
      if (rest.length > 0) {
        validationErrors[field.trim()] = rest.join(":").trim();
      }
    }

    return Promise.reject(new AppError(message, status, validationErrors));
  },
);