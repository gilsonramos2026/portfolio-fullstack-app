import { PROJECT_STATUS_LABEL, type Project, type ProjectPayload, type ProjectStatus } from "../../types/project";
import { ImageUploadField } from "../ui/ImageUploadField";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { ProjectImageManager } from "./ProjectImageManager";
import { ProjectTechStackInput } from "./TechStackInput";

interface ProjectFormFieldsProps {
  form: ProjectPayload;
  onChangeField: <K extends keyof ProjectPayload>(key: K, value: ProjectPayload[K]) => void;
  errors: Record<string, string>;
  isEditing: boolean;
  project?: Project;
}

export function ProjectFormFields({
  form,
  onChangeField,
  errors,
  isEditing,
  project,
}: ProjectFormFieldsProps) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Título"
            required
            value={form.title}
            onChange={(e) => onChangeField("title", e.target.value)}
            error={errors.title}
          />
        </div>

        <div className="sm:col-span-2">
          <Input
            label="Descrição curta"
            required
            value={form.shortDescription}
            onChange={(e) => onChangeField("shortDescription", e.target.value)}
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
            onChange={(e) => onChangeField("status", e.target.value as ProjectStatus)}
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
          onChange={(e) => onChangeField("displayOrder", Number(e.target.value))}
          hint="Menor número aparece primeiro."
        />

        <Input
          label="Data de início"
          type="date"
          value={form.startDate}
          onChange={(e) => onChangeField("startDate", e.target.value)}
        />

        <Input
          label="Data de conclusão"
          type="date"
          value={form.endDate}
          onChange={(e) => onChangeField("endDate", e.target.value)}
          hint="Deixe em branco se o projeto ainda está em andamento."
        />

        <Input
          label="URL do repositório"
          value={form.repositoryUrl}
          onChange={(e) => onChangeField("repositoryUrl", e.target.value)}
          placeholder="https://github.com/usuario/projeto"
          error={errors.repositoryUrl}
        />

        <Input
          label="URL da demo"
          value={form.demoUrl}
          onChange={(e) => onChangeField("demoUrl", e.target.value)}
          placeholder="https://projeto.vercel.app"
          error={errors.demoUrl}
        />

        <div className="sm:col-span-2">
          <ImageUploadField
            label="Imagem de capa (fallback)"
            value={form.imageUrl ?? ""}
            onChange={(url) => onChangeField("imageUrl", url)}
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
          onChange={(e) => onChangeField("description", e.target.value)}
          error={errors.description}
        />
      </div>

      <ProjectTechStackInput
        techStack={form.techStack}
        onChange={(techs) => onChangeField("techStack", techs)}
      />

      <label className="mt-5 flex items-center gap-2.5 text-sm text-(--t2)">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => onChangeField("featured", e.target.checked)}
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
    </>
  );
}