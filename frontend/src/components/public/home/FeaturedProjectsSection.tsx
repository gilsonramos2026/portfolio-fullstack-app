import { Link } from "react-router-dom";
import type { PageResponse } from "../../../types/api";
import type { Project } from "../../../types/project";
import { FadeIn } from "../../ui/FadeIn";
import { ProjectListSkeleton } from "../ProjectCardSkeleton";
import { ProjectCard } from "../ProjectCard";


interface FeaturedProjectsSectionProps {
  featured?: PageResponse<Project>;
  isLoading: boolean;
}

export function FeaturedProjectsSection({ featured, isLoading }: FeaturedProjectsSectionProps) {
  return (
    <section className="border-t border-(--bd) py-14">
      <FadeIn className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-400">
            Portfólio
          </p>
          <h2 className="text-2xl font-bold text-(--t1) sm:text-3xl">Projetos em destaque</h2>
        </div>
        <Link to="/projetos" className="nav-link">
          Ver todos
        </Link>
      </FadeIn>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectListSkeleton count={3} />
        </div>
      ) : featured?.content.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.content.map((project, index) => (
            <FadeIn key={project.id} delay={index * 70}>
              <ProjectCard project={project} />
            </FadeIn>
          ))}
        </div>
      ) : (
        <p className="py-8 text-sm text-(--t4)">Nenhum projeto em destaque no momento.</p>
      )}
    </section>
  );
}