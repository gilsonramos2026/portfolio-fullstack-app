import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import type { Certification, CertificationPayload } from "../../types/certification";
import { useCertifications, useCreateCertification, useDeleteCertification, useUpdateCertification } from "../../hooks/useCertifications";
import { Input } from "../ui/Input";
import { ImageUploadField } from "../ui/ImageUploadField";
import { Button } from "../ui/Button";
import { Skeleton } from "../ui/Skeleton";
import { formatMonthYear } from "../../utils/formatters";


const EMPTY_FORM: CertificationPayload = {
  name: "",
  issuer: "",
  issueDate: "",
  expirationDate: "",
  credentialUrl: "",
  imageUrl: "",
  displayOrder: 0,
};

export function CertificationManager() {
  const { data: certifications, isLoading } = useCertifications();
  const createCertification = useCreateCertification();
  const updateCertification = useUpdateCertification();
  const deleteCertification = useDeleteCertification();

  const [form, setForm] = useState<CertificationPayload>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);

  function updateField<K extends keyof CertificationPayload>(key: K, value: CertificationPayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(cert: Certification) {
    setEditingId(cert.id);
    setForm({
      name: cert.name,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      expirationDate: cert.expirationDate ?? "",
      credentialUrl: cert.credentialUrl ?? "",
      imageUrl: cert.imageUrl ?? "",
      displayOrder: cert.displayOrder,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const payload = { ...form, expirationDate: form.expirationDate || undefined };
    if (editingId !== null) {
      await updateCertification.mutateAsync({ id: editingId, payload });
    } else {
      await createCertification.mutateAsync(payload);
    }
    cancelEdit();
  }

  async function handleDelete(id: number) {
    if (!confirm("Remover esta certificação?")) return;
    try {
      await deleteCertification.mutateAsync(id);
      toast.success("Certificação removida.");
    } catch {
      toast.error("Não foi possível remover.");
    }
  }

  const isSaving = createCertification.isPending || updateCertification.isPending;

  return (
    <div>
      <form onSubmit={handleSubmit} className="card grid gap-4 p-6 sm:grid-cols-2">
        <Input label="Nome da certificação" required value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Ex: AWS Certified Cloud Practitioner" />
        <Input label="Emissor" required value={form.issuer} onChange={(e) => updateField("issuer", e.target.value)} placeholder="Ex: Amazon Web Services" />
        <Input label="Data de emissão" type="date" required value={form.issueDate} onChange={(e) => updateField("issueDate", e.target.value)} />
        <Input label="Data de expiração" type="date" value={form.expirationDate} onChange={(e) => updateField("expirationDate", e.target.value)} hint="Deixe em branco se não expira." />
        <Input label="URL da credencial" value={form.credentialUrl} onChange={(e) => updateField("credentialUrl", e.target.value)} placeholder="https://credly.com/..." />
        <Input label="Ordem" type="number" value={form.displayOrder} onChange={(e) => updateField("displayOrder", Number(e.target.value))} />
        <div className="sm:col-span-2">
          <ImageUploadField label="Badge/imagem" value={form.imageUrl ?? ""} onChange={(url) => updateField("imageUrl", url)} hint="Opcional. JPG, PNG ou WEBP, até 5MB." />
        </div>
        <div className="flex items-center gap-3 sm:col-span-2">
          <Button type="submit" isLoading={isSaving}>
            {editingId !== null ? "Salvar alterações" : "Adicionar certificação"}
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
        ) : certifications?.length ? (
          <div className="overflow-hidden rounded-2xl border border-(--bd) bg-(--s1)">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between gap-4 border-b border-(--bd) px-5 py-3.5 last:border-b-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-(--t1)">{cert.name}</p>
                  <p className="text-xs text-(--t4)">
                    {cert.issuer} · {formatMonthYear(cert.issueDate)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button onClick={() => startEdit(cert)} className="rounded-lg p-2 text-(--t4) transition-colors hover:bg-(--cb) hover:text-(--t1)" aria-label="Editar">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(cert.id)} className="rounded-lg p-2 text-(--t4) transition-colors hover:bg-red-500/10 hover:text-red-400" aria-label="Excluir">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-(--bd) p-6 text-center text-sm text-(--t4)">
            Nenhuma certificação cadastrada ainda.
          </p>
        )}
      </div>
    </div>
  );
}
