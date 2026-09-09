import { useMemo } from "react";
import { useProjects } from "./useProjects";

/**
 * O Profile não guarda uma lista de tecnologias própria — a stack exibida
 * na Home/Sobre é derivada dos projetos reais cadastrados, ordenada pela
 * frequência de uso. Isso evita duplicidade de manutenção para o Admin
 * (uma lista "solta" que poderia divergir do que os projetos realmente usam).
 */
export function useTechStackSummary() {
  const { data, isLoading } = useProjects({ size: 100 });

  const techStack = useMemo(() => {
    if (!data) return [];
    const counts = new Map<string, number>();
    for (const project of data.content) {
      for (const tech of project.techStack) {
        counts.set(tech, (counts.get(tech) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tech]) => tech);
  }, [data]);

  return { techStack, isLoading };
}
