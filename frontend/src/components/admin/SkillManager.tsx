import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import { useCreateSkill, useDeleteSkill, useSkills, useUpdateSkill } from "@/hooks/useSkills";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Skill, SkillPayload } from "@/types/skill";

const EMPTY_FORM: SkillPayload = { name: "", category: "", proficiency: 70, displayOrder: 0 };

export function SkillManager() {
  const { data: skills, isLoading } = useSkills();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();

  const [form, setForm] = useState<SkillPayload>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);

  function updateField<K extends keyof SkillPayload>(key: K, value: SkillPayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(skill: Skill) {
    setEditingId(skill.id);
    setForm({
      name: skill.name,
      category: skill.category ?? "",
      proficiency: skill.proficiency,
      displayOrder: skill.displayOrder,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (editingId !== null) {
      await updateSkill.mutateAsync({ id: editingId, payload: form });
    } else {
      await createSkill.mutateAsync(form);
    }
    cancelEdit();
  }

  async function handleDelete(id: number) {
    if (!confirm("Remover esta habilidade?")) return;
    try {
      await deleteSkill.mutateAsync(id);
      toast.success("Habilidade removida.");
    } catch {
      toast.error("Não foi possível remover.");
    }
  }

  const isSaving = createSkill.isPending || updateSkill.isPending;

  return (
    <div>
      <form onSubmit={handleSubmit} className="card grid gap-4 p-6 sm:grid-cols-2">
        <Input label="Nome" required value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Ex: React" />
        <Input label="Categoria" value={form.category} onChange={(e) => updateField("category", e.target.value)} placeholder="Ex: Frontend" />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-(--t2)">Proficiência ({form.proficiency}%)</label>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={form.proficiency}
            onChange={(e) => updateField("proficiency", Number(e.target.value))}
            className="accent-(--color-brand-500)"
          />
        </div>
        <Input
          label="Ordem"
          type="number"
          value={form.displayOrder}
          onChange={(e) => updateField("displayOrder", Number(e.target.value))}
        />
        <div className="flex items-center gap-3 sm:col-span-2">
          <Button type="submit" isLoading={isSaving}>
            {editingId !== null ? "Salvar alterações" : "Adicionar habilidade"}
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
        ) : skills?.length ? (
          <div className="overflow-hidden rounded-2xl border border-(--bd) bg-(--s1)">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between gap-4 border-b border-(--bd) px-5 py-3.5 last:border-b-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-(--t1)">
                    {skill.name} {skill.category && <span className="text-(--t4)">· {skill.category}</span>}
                  </p>
                  <div className="skill-bar mt-1.5 max-w-xs">
                    <div className="skill-bar-fill" style={{ width: `${skill.proficiency}%` }} />
                  </div>
                </div>
                <span className="shrink-0 text-xs text-(--t4)">{skill.proficiency}%</span>
                <div className="flex shrink-0 items-center gap-1">
                  <button onClick={() => startEdit(skill)} className="rounded-lg p-2 text-(--t4) transition-colors hover:bg-(--cb) hover:text-(--t1)" aria-label="Editar">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(skill.id)} className="rounded-lg p-2 text-(--t4) transition-colors hover:bg-red-500/10 hover:text-red-400" aria-label="Excluir">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-(--bd) p-6 text-center text-sm text-(--t4)">
            Nenhuma habilidade cadastrada ainda.
          </p>
        )}
      </div>
    </div>
  );
}
