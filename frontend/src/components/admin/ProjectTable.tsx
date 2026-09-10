import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Pencil, Star, Trash2 } from "lucide-react";
import { clsx } from "clsx";
import { useDeleteProject } from "../../hooks/useProjectMutations";
import type { Project } from "../../types/project";
import { statusLabel, statusToneClasses } from "../../utils/formatters";

export function ProjectTable({ projects }: { projects: Project[] }) {
  const deleteProject = useDeleteProject();

  async function handleDelete(project: Project) {
    if (!confirm(`Excluir "${project.title}"? Essa ação não pode ser desfeita.`)) return;
    try {
      await deleteProject.mutateAsync(project.id);
      toast.success("Projeto excluído.");
    } catch {
      toast.error("Não foi possível excluir o projeto.");
    }
  }

  if (!projects.length) {
    return (
      <p className="rounded-2xl border border-dashed border-(--bd) p-8 text-center text-sm text-(--t4)">
        Nenhum projeto cadastrado ainda. Crie o primeiro para publicá-lo no site.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-(--bd) bg-(--s1)">
      {projects.map((project) => (
        <div
          key={project.id}
          className="flex flex-col gap-3 border-b border-(--bd) px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            {project.featured && <Star size={14} className="shrink-0 text-amber-400" fill="currentColor" />}
            <div>
              <p className="text-sm font-medium text-(--t1)">{project.title}</p>
              <p className="text-xs text-(--t4)">{project.shortDescription}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={clsx(
                "rounded-full border px-2 py-0.5 text-xs font-medium",
                statusToneClasses(project.status),
              )}
            >
              {statusLabel(project.status)}
            </span>
            <Link
              to={`/admin/projetos/${project.id}`}
              className="rounded-lg p-2 text-(--t4) transition-colors hover:bg-(--cb) hover:text-(--t1)"
              aria-label="Editar"
            >
              <Pencil size={15} />
            </Link>
            <button
              onClick={() => handleDelete(project)}
              className="rounded-lg p-2 text-(--t4) transition-colors hover:bg-red-500/10 hover:text-red-400"
              aria-label="Excluir"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
