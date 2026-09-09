import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import {
  useCreateEducation,
  useDeleteEducation,
  useEducations,
  useUpdateEducation,
} from "@/hooks/useEducations";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatMonthYear } from "@/utils/formatters";
import type { Education, EducationPayload } from "@/types/education";

const EMPTY_FORM: EducationPayload = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  startDate: "",
  endDate: "",
  description: "",
  displayOrder: 0,
};

export function EducationManager() {
  const { data: educations, isLoading } = useEducations();
  const createEducation = useCreateEducation();
  const updateEducation = useUpdateEducation();
  const deleteEducation = useDeleteEducation();

  const [form, setForm] = useState<EducationPayload>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);

  function updateField<K extends keyof EducationPayload>(key: K, value: EducationPayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(edu: Education) {
    setEditingId(edu.id);
    setForm({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy ?? "",
      startDate: edu.startDate,
      endDate: edu.endDate ?? "",
      description: edu.description ?? "",
      displayOrder: edu.displayOrder,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const payload = { ...form, endDate: form.endDate || undefined };
    if (editingId !== null) {
      await updateEducation.mutateAsync({ id: editingId, payload });
    } else {
      await createEducation.mutateAsync(payload);
    }
    cancelEdit();
  }

  async function handleDelete(id: number) {
    if (!confirm("Remover esta formação acadêmica?")) return;
    try {
      await deleteEducation.mutateAsync(id);
      toast.success("Formação acadêmica removida.");
    } catch {
      toast.error("Não foi possível remover.");
    }
  }

  const isSaving = createEducation.isPending || updateEducation.isPending;

  return (
    <div>
      <form onSubmit={handleSubmit} className="card grid gap-4 p-6 sm:grid-cols-2">
        <Input label="Instituição" required value={form.institution} onChange={(e) => updateField("institution", e.target.value)} />
        <Input label="Curso/Grau" required value={form.degree} onChange={(e) => updateField("degree", e.target.value)} placeholder="Ex: Análise e Desenvolvimento de Sistemas" />
        <Input label="Área de estudo" value={form.fieldOfStudy} onChange={(e) => updateField("fieldOfStudy", e.target.value)} />
        <div />
        <Input label="Início" type="date" required value={form.startDate} onChange={(e) => updateField("startDate", e.target.value)} />
        <Input
          label="Conclusão"
          type="date"
          value={form.endDate}
          onChange={(e) => updateField("endDate", e.target.value)}
          hint="Deixe em branco se ainda estiver cursando."
        />
        <div className="sm:col-span-2">
          <Textarea label="Descrição" value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={3} />
        </div>
        <Input
          label="Ordem"
          type="number"
          value={form.displayOrder}
          onChange={(e) => updateField("displayOrder", Number(e.target.value))}
        />
        <div className="flex items-end gap-3">
          <Button type="submit" isLoading={isSaving}>
            {editingId !== null ? "Salvar alterações" : "Adicionar formação"}
          </Button>
          {editingId !== null && (
            <Button type="button" variant="ghost" onClick={cancelEdit}>
              Cancelar
            </Button>
          )}
        </div>
      </form>

      <div className="mt-6">
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : educations?.length ? (
          <div className="overflow-hidden rounded-2xl border border-(--bd) bg-(--s1)">
            {educations.map((edu) => (
              <div key={edu.id} className="flex items-center justify-between gap-4 border-b border-(--bd) px-5 py-3.5 last:border-b-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-(--t1)">{edu.degree}</p>
                  <p className="text-xs text-(--t4)">
                    {edu.institution} · {formatMonthYear(edu.startDate)} — {edu.endDate ? formatMonthYear(edu.endDate) : "atual"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button onClick={() => startEdit(edu)} className="rounded-lg p-2 text-(--t4) transition-colors hover:bg-(--cb) hover:text-(--t1)" aria-label="Editar">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(edu.id)} className="rounded-lg p-2 text-(--t4) transition-colors hover:bg-red-500/10 hover:text-red-400" aria-label="Excluir">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-(--bd) p-6 text-center text-sm text-(--t4)">
            Nenhuma formação cadastrada ainda.
          </p>
        )}
      </div>
    </div>
  );
}
