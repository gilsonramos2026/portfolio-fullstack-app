import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { ProjectPayload } from "../../types/project";
import { useProject } from "../../hooks/useProject";
import { useCreateProject, useUpdateProject } from "../../hooks/useProjectMutations";
import type { AppError } from "../../services/apiClient";
import { Skeleton } from "../../components/ui/Skeleton";
import { ProjectFormFields } from "../../components/admin/ProjectFormFields";
import { Button } from "../../components/ui/Button";

const EMPTY_FORM: ProjectPayload = {
  title: "",
  shortDescription: "",
  description: "",
  techStack: [],
  repositoryUrl: "",
  demoUrl: "",
  imageUrl: "",
  status: "IN_PROGRESS",
  featured: false,
  displayOrder: 0,
  startDate: "",
  endDate: "",
};

export function ProjectFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== undefined && id !== "novo";
  const navigate = useNavigate();

  const { data: project, isLoading } = useProject(isEditing ? id : undefined);
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const [form, setForm] = useState<ProjectPayload>(() => {
    if (!project) return EMPTY_FORM;
    return {
      title: project.title,
      shortDescription: project.shortDescription,
      description: project.description,
      techStack: project.techStack,
      repositoryUrl: project.repositoryUrl ?? "",
      demoUrl: project.demoUrl ?? "",
      imageUrl: project.imageUrl ?? "",
      status: project.status,
      featured: project.featured,
      displayOrder: project.displayOrder,
      startDate: project.startDate ?? "",
      endDate: project.endDate ?? "",
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  function updateField<K extends keyof ProjectPayload>(key: K, value: ProjectPayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrors({});
    setFeedback(null);
    try {
      if (isEditing && project) {
        await updateProject.mutateAsync({ id: project.id, payload: form });
      } else {
        await createProject.mutateAsync(form);
      }
      navigate("/admin/projetos");
    } catch (err) {
      const appError = err as AppError;
      setErrors(appError.validationErrors ?? {});
      setFeedback(appError.message);
    }
  }

  const isSaving = createProject.isPending || updateProject.isPending;

  if (isEditing && isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/admin/projetos")}
        className="inline-flex items-center gap-1.5 text-sm text-(--t4) transition-colors hover:text-(--t1)"
      >
        <ArrowLeft size={15} />
        Projetos
      </button>

      <h1 className="mt-4 text-2xl font-bold text-(--t1)">
        {isEditing ? "Editar projeto" : "Novo projeto"}
      </h1>

      <form
        key={project ? project.id : "new"}
        onSubmit={handleSubmit}
        className="mt-6 card p-6"
      >
        <ProjectFormFields
          form={form}
          onChangeField={updateField}
          errors={errors}
          isEditing={isEditing}
          project={project}
        />

        <div className="mt-6 flex items-center gap-4">
          <Button type="submit" isLoading={isSaving}>
            {isEditing ? "Salvar alterações" : "Criar projeto"}
          </Button>
          {feedback && <span className="text-sm text-red-400">{feedback}</span>}
        </div>
      </form>
    </div>
  );
}