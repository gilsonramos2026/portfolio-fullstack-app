import { useQuery } from "@tanstack/react-query";

export interface GitHubStats {
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
  avatarUrl: string;
  htmlUrl: string;
}

/** Extrai o username a partir de uma URL do GitHub (ex: "https://github.com/fulano" → "fulano"). */
export function extractGithubUsername(githubUrl: string | undefined): string | null {
  if (!githubUrl) return null;
  try {
    const { pathname } = new URL(githubUrl);
    const username = pathname.split("/").filter(Boolean)[0];
    return username || null;
  } catch {
    return null;
  }
}

async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  const response = await fetch(`https://api.github.com/users/${username}`);
  if (!response.ok) {
    throw new Error("Não foi possível carregar as estatísticas do GitHub.");
  }
  const data = await response.json();
  return {
    publicRepos: data.public_repos,
    followers: data.followers,
    following: data.following,
    createdAt: data.created_at,
    avatarUrl: data.avatar_url,
    htmlUrl: data.html_url,
  };
}

/**
 * Busca dados públicos e reais direto da API do GitHub — client-side,
 * sem passar pelo nosso backend e sem precisar de chave de API (o limite
 * não-autenticado é 60 req/hora por IP, mais que suficiente com o cache
 * do TanStack Query).
 */
export function useGitHubStats(githubUrl: string | undefined) {
  const username = extractGithubUsername(githubUrl);

  return useQuery({
    queryKey: ["github-stats", username],
    queryFn: () => fetchGitHubStats(username as string),
    enabled: !!username,
    staleTime: 30 * 60 * 1000, // 30 min — esses números não mudam a cada segundo
    retry: 1,
  });
}
