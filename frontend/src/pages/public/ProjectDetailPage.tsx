import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { clsx } from "clsx";
import { useProject } from "../../hooks/useProject";
import { Skeleton } from "../../components/ui/Skeleton";
import { Seo } from "../../components/ui/Seo";
import { formatDate, statusLabel, statusToneClasses } from "../../utils/formatters";
import { ProjectGallery } from "../../components/public/ProjectGallery";
import { TechBadge } from "../../utils/techIcons";
import { fadeUp } from "../../lib/motionVariants";

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, isError } = useProject(id);

  if (isError) {
    return (
      <div className="content-container flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-(--t1)">Projeto não encontrado</h1>
        <p className="text-(--t3)">Ele pode ter sido removido ou o link está incorreto.</p>
        <Link to="/projetos" className="text-sm text-brand-400 hover:underline">
          Voltar para projetos
        </Link>
      </div>
    );
  }

  return (
    <div className="content-container max-w-3xl py-12 sm:py-20">
      <Link
        to="/projetos"
        className="inline-flex items-center gap-1.5 text-sm text-(--t3) transition-colors hover:text-(--t1)"
      >
        <ArrowLeft size={15} />
        Todos os projetos
      </Link>

      {isLoading ? (
        <div className="mt-8 flex flex-col gap-4">
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ) : project ? (
        <motion.article className="mt-8" initial="hidden" animate="visible" variants={fadeUp}>
          <Seo
            title={project.title}
            description={project.shortDescription}
            image={project.images?.[0]?.url ?? project.imageUrl}
          />
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-(--t1)">{project.title}</h1>
            <span className={clsx("rounded-full border px-2.5 py-1 text-xs font-medium", statusToneClasses(project.status))}>
              {statusLabel(project.status)}
            </span>
          </div>

          <p className="mt-2 font-mono text-xs text-(--t4)">
            atualizado em {formatDate(project.updatedAt)}
          </p>

          {project.images?.length ? (
            <ProjectGallery images={project.images} title={project.title} />
          ) : (
            project.imageUrl && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-(--bd)">
                <img src={project.imageUrl} alt={project.title} className="w-full object-cover" />
              </div>
            )
          )}

          <p className="mt-8 whitespace-pre-line text-balance leading-relaxed text-(--t2)">
            {project.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {project.techStack.map((tech: string) => (
              <TechBadge key={tech} tech={tech} />
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            {project.repositoryUrl && (
              <a href={project.repositoryUrl} target="_blank" rel="noreferrer noopener" className="btn-outline">
                <Github size={16} />
                Repositório
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noreferrer noopener" className="btn-primary">
                <ExternalLink size={16} />
                Ver demo
              </a>
            )}
          </div>
        </motion.article>
      ) : null}
    </div>
  );
}