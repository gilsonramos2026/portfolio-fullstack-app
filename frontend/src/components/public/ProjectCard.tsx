import { Link } from "react-router-dom";
import { Github, ExternalLink } from "lucide-react";
import { clsx } from "clsx";
import type { Project } from "@/types/project";
import { TechBadge } from "@/utils/techIcons";
import { statusLabel, statusToneClasses } from "@/utils/formatters";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const coverUrl = project.images?.[0]?.url ?? project.imageUrl;

  return (
    <div className="card group flex h-full flex-col overflow-hidden">
      <Link to={`/projetos/${project.id}`}>
        <div className="aspect-video overflow-hidden bg-(--s2)">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-(--t5)">
              {project.title[0]}
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/projetos/${project.id}`}>
            <h3 className="font-semibold text-(--t1) transition-colors group-hover:text-(--color-brand-400)">
              {project.title}
            </h3>
          </Link>
          <span className={clsx("shrink-0 rounded-full border px-2 py-0.5 text-xs", statusToneClasses(project.status))}>
            {statusLabel(project.status)}
          </span>
        </div>

        <p className="line-clamp-2 flex-1 text-sm text-(--t3)">{project.shortDescription}</p>

        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 5).map((tech) => (
            <TechBadge key={tech} tech={tech} size={13} />
          ))}
        </div>

        <div className="flex gap-4 pt-1">
          {project.repositoryUrl && (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-1.5 text-xs text-(--t4) transition-colors hover:text-(--t1)"
            >
              <Github size={14} /> Código
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-1.5 text-xs text-(--t4) transition-colors hover:text-(--color-brand-400)"
            >
              <ExternalLink size={14} /> Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
