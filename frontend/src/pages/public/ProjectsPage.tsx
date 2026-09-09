import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { clsx } from "clsx";
import { useProjects } from "../../hooks/useProjects";
import type { PageResponse } from "../../types/api";
import type { Project } from "../../types/project";
import { Seo } from "../../components/ui/Seo";
import { FadeIn } from "../../components/ui/FadeIn";
import { ProjectListSkeleton } from "../../components/public/ProjectCardSkeleton";
import { ProjectCard } from "../../components/public/ProjectCard";


export function ProjectsPage() {
  const { data: rawData, isLoading } = useProjects({ size: 48 });
  const data = rawData as PageResponse<Project> | undefined;

  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(
    () => Array.from(new Set(data?.content.flatMap((p: Project) => p.techStack) ?? [])).sort(),
    [data],
  );

  const filtered = data?.content.filter((p: Project) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchTag = !activeTag || p.techStack.includes(activeTag);
    return matchSearch && matchTag;
  });

  return (
    <div className="content-container py-12 sm:py-20">
      <Seo title="Projetos" description="Projetos, código e stack técnica." />

      <FadeIn className="mb-10">
        <h1 className="mb-3 text-3xl font-bold text-(--t1) sm:text-4xl">Projetos</h1>
        <p className="max-w-xl text-(--t3)">
          {data ? `${data.totalElements} projeto${data.totalElements === 1 ? "" : "s"} publicado${data.totalElements === 1 ? "" : "s"}.` : "Carregando projetos..."}
        </p>
      </FadeIn>

      <FadeIn delay={100} className="mb-8 space-y-4">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--t4)" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar projetos..."
            className="input pl-9"
          />
        </div>
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={clsx(
                "tag cursor-pointer transition-all",
                !activeTag && "border-brand-500 bg-brand-500 text-white",
              )}
            >
              Todos
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={clsx(
                  "tag cursor-pointer transition-all",
                  activeTag === tag && "border-brand-500 bg-brand-500 text-white",
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </FadeIn>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectListSkeleton count={6} />
        </div>
      ) : filtered?.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, index) => (
            <FadeIn key={project.id} delay={index * 60}>
              <ProjectCard project={project} />
            </FadeIn>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-(--t4)">
          Nenhum projeto encontrado.
        </p>
      )}
    </div>
  );
}