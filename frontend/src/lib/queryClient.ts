import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 min: conteúdo de portfólio muda pouco
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

/** Chaves de query centralizadas — evita strings soltas espalhadas pelos hooks. */
export const queryKeys = {
  profile: ["profile"] as const,
  addresses: ["addresses"] as const,
  projects: (params?: Record<string, unknown> | object) => ["projects", params] as const,
  project: (id: number | string) => ["project", id] as const,
};
