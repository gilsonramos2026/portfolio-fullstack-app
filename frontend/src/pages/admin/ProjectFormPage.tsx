import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import { PROJECT_STATUS_LABEL, type ProjectPayload, type ProjectStatus } from "../../types/project";
import { useProject } from "../../hooks/useProject";
import { useCreateProject, useUpdateProject } from "../../hooks/useProjectMutations";
import type { AppError } from "../../services/apiClient";
import { Skeleton } from "../../components/ui/Skeleton";
import { Input } from "../../components/ui/Input";
import { ImageUploadField } from "../../components/ui/ImageUploadField";
import { Textarea } from "../../components/ui/Textarea";
import { Button } from "../../components/ui/Button";
import { ProjectImageManager } from "../../components/admin/ProjectImageManager";

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

export function ProjectsAdminPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== undefined && id !== "novo";
  const navigate = useNavigate();

  const { data: project, isLoading } = useProject(isEditing ? id : undefined);
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  // Inicializa o estado de forma segura com os dados do projeto se já existirem
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

  const [newTech, setNewTech] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  function updateField<K extends keyof ProjectPayload>(key: K, value: ProjectPayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addTech() {
    const tech = newTech.trim();
    if (!tech || form.techStack.includes(tech)) return;
    updateField("techStack", [...form.techStack, tech]);
    setNewTech("");
  }

  function removeTech(tech: string) {
    updateField(
      "techStack",
      form.techStack.filter((t) => t !== tech),
    );
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

      {/* A key garante que o formulário reinicialize corretamente assim que o projeto terminar de carregar */}
      <form
        key={project ? project.id : "new"}
        onSubmit={handleSubmit}
        className="mt-6 card p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Título"
              required
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              error={errors.title}
            />
          </div>

          <div className="sm:col-span-2">
            <Input
              label="Descrição curta"
              required
              value={form.shortDescription}
              onChange={(e) => updateField("shortDescription", e.target.value)}
              hint="Aparece na listagem de projetos. Máx. ~140 caracteres."
              error={errors.shortDescription}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-(--t2)" htmlFor="project-status">
              Status
            </label>
            <select
              id="project-status"
              value={form.status}
              onChange={(e) => updateField("status", e.target.value as ProjectStatus)}
              className="input"
            >
              {Object.entries(PROJECT_STATUS_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Ordem de exibição"
            type="number"
            value={form.displayOrder}
            onChange={(e) => updateField("displayOrder", Number(e.target.value))}
            hint="Menor número aparece primeiro."
          />

          <Input
            label="Data de início"
            type="date"
            value={form.startDate}
            onChange={(e) => updateField("startDate", e.target.value)}
          />

          <Input
            label="Data de conclusão"
            type="date"
            value={form.endDate}
            onChange={(e) => updateField("endDate", e.target.value)}
            hint="Deixe em branco se o projeto ainda está em andamento."
          />

          <Input
            label="URL do repositório"
            value={form.repositoryUrl}
            onChange={(e) => updateField("repositoryUrl", e.target.value)}
            placeholder="https://github.com/usuario/projeto"
            error={errors.repositoryUrl}
          />

          <Input
            label="URL da demo"
            value={form.demoUrl}
            onChange={(e) => updateField("demoUrl", e.target.value)}
            placeholder="https://projeto.vercel.app"
            error={errors.demoUrl}
          />

          <div className="sm:col-span-2">
            <ImageUploadField
              label="Imagem de capa (fallback)"
              value={form.imageUrl ?? ""}
              onChange={(url) => updateField("imageUrl", url)}
              aspect="wide"
              hint="Usada apenas se a galeria de screenshots abaixo estiver vazia. JPG, PNG ou WEBP, até 5MB."
              error={errors.imageUrl}
            />
          </div>
        </div>

        <div className="mt-4">
          <Textarea
            label="Descrição completa"
            required
            rows={7}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            error={errors.description}
          />
        </div>

        <div className="mt-4">
          <span className="text-sm font-medium text-(--t2)">Tech stack do projeto</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {form.techStack.map((tech) => (
              <span key={tech} className="chip font-mono">
                {tech}
                <button type="button" onClick={() => removeTech(tech)} aria-label={`Remover ${tech}`}>
                  <X size={12} className="text-(--t4) hover:text-red-400" />
                </button>
              </span>
            ))}
          </div>
          <div className="mt-3 flex max-w-xs gap-2">
            <input
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTech();
                }
              }}
              placeholder="Ex: React, PostgreSQL"
              className="input flex-1"
            />
            <Button type="button" variant="secondary" onClick={addTech}>
              <Plus size={15} />
            </Button>
          </div>
        </div>

        <label className="mt-5 flex items-center gap-2.5 text-sm text-(--t2)">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => updateField("featured", e.target.checked)}
            className="h-4 w-4 accent-brand-500"
          />
          Marcar como projeto em destaque
        </label>

        {isEditing && project ? (
          <div className="mt-6 border-t border-(--bd) pt-5">
            <ProjectImageManager projectId={project.id} images={project.images} />
          </div>
        ) : (
          <div className="mt-6 border-t border-(--bd) pt-5">
            <p className="rounded-xl bg-(--cb) p-3 text-xs text-(--t4)">
              💡 Salve o projeto primeiro para adicionar screenshots à galeria.
            </p>
          </div>
        )}

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