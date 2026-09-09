import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";
import type { ProfilePayload } from "../../types/profile";
import { useProfile } from "../../hooks/useProfile";
import { useUpdateProfile } from "../../hooks/useProfileMutations";
import type { AppError } from "../../services/apiClient";
import { Skeleton } from "../../components/ui/Skeleton";
import { ImageUploadField } from "../../components/ui/ImageUploadField";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { DocumentUploadField } from "../../components/ui/DocumentUploadField";
import { Textarea } from "../../components/ui/Textarea";

const EMPTY_FORM: ProfilePayload = {
  fullName: "",
  headline: "",
  bio: "",
  photoUrl: "",
  email: "",
  phone: "",
  githubUrl: "",
  instagramUrl: "",
  twitterUrl: "",
  linkedinUrl: "",
  websiteUrl: "",
  resumeUrl: "",
  roles: [],
  availableForWork: true,
};

export function ProfileSettingsPage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  // Inicializa com o EMPTY_FORM seguro. Se o perfil já vier cacheado, aproveita os dados.
  const [form, setForm] = useState<ProfilePayload>(() => {
    if (!profile) return EMPTY_FORM;
    return {
      fullName: profile.fullName ?? "",
      headline: profile.headline ?? "",
      bio: profile.bio ?? "",
      photoUrl: profile.photoUrl ?? "",
      email: profile.email ?? "",
      phone: profile.phone ?? "",
      githubUrl: profile.githubUrl ?? "",
      instagramUrl: profile.instagramUrl ?? "",
      twitterUrl: profile.twitterUrl ?? "",
      linkedinUrl: profile.linkedinUrl ?? "",
      websiteUrl: profile.websiteUrl ?? "",
      resumeUrl: profile.resumeUrl ?? "",
      roles: profile.roles ?? [],
      availableForWork: profile.availableForWork ?? true,
    };
  });

  const [newRole, setNewRole] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function updateField<K extends keyof ProfilePayload>(key: K, value: ProfilePayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addRole() {
    const role = newRole.trim();
    if (!role || form.roles.includes(role)) return;
    updateField("roles", [...form.roles, role]);
    setNewRole("");
  }

  function removeRole(role: string) {
    updateField(
      "roles",
      form.roles.filter((r) => r !== role),
    );
  }

  function handleRoleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addRole();
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrors({});
    setFeedback(null);
    try {
      await updateProfile.mutateAsync(form);
      setFeedback("Perfil atualizado com sucesso.");
    } catch (err) {
      const appError = err as AppError;
      setErrors(appError.validationErrors ?? {});
      setFeedback(appError.message);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-(--t1)">Perfil & Dados</h1>
      <p className="mt-1 text-sm text-(--t4)">
        Essas informações alimentam a Home, a página Sobre e o rodapé do site público.
      </p>

      {/* A key garante que o form monte com os dados atualizados assim que o profile terminar de carregar */}
      <form
        key={profile ? JSON.stringify(profile) : "loading"}
        onSubmit={handleSubmit}
        className="mt-8 card p-6"
      >
        {/* Foto de perfil */}
        <div className="flex flex-col gap-4 border-b border-(--bd) pb-6">
          <ImageUploadField
            label="Foto de perfil"
            value={form.photoUrl}
            onChange={(url) => updateField("photoUrl", url)}
            hint="JPG, PNG ou WEBP, até 5MB."
            error={errors.photoUrl}
          />
        </div>

        {/* Dados pessoais */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Input
            label="Nome completo"
            required
            value={form.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            error={errors.fullName}
          />
          <Input
            label="Headline profissional"
            value={form.headline}
            onChange={(e) => updateField("headline", e.target.value)}
            placeholder="Ex: Desenvolvedora Full-Stack Júnior"
            hint="Usado como texto único caso nenhum cargo alternado seja cadastrado abaixo."
            error={errors.headline}
          />
          <Input
            label="E-mail"
            type="email"
            required
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            error={errors.email}
          />
          <Input
            label="Telefone"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            error={errors.phone}
          />
          <Input
            label="LinkedIn"
            value={form.linkedinUrl}
            onChange={(e) => updateField("linkedinUrl", e.target.value)}
            error={errors.linkedinUrl}
          />
          <Input
            label="GitHub"
            value={form.githubUrl}
            onChange={(e) => updateField("githubUrl", e.target.value)}
            error={errors.githubUrl}
          />
          <Input
            label="Instagram"
            value={form.instagramUrl}
            onChange={(e) => updateField("instagramUrl", e.target.value)}
            placeholder="https://instagram.com/seuusuario"
            error={errors.instagramUrl}
          />
          <Input
            label="X (Twitter)"
            value={form.twitterUrl}
            onChange={(e) => updateField("twitterUrl", e.target.value)}
            placeholder="https://x.com/seuusuario"
            error={errors.twitterUrl}
          />
          <Input
            label="Website pessoal"
            value={form.websiteUrl}
            onChange={(e) => updateField("websiteUrl", e.target.value)}
            error={errors.websiteUrl}
          />
        </div>

        {/* Cargos alternados */}
        <div className="mt-6 border-t border-(--bd) pt-5">
          <span className="text-sm font-medium text-(--t2)">Cargos alternados no hero</span>
          <p className="mt-1 text-xs text-(--t4)">
            Alternam continuamente em efeito de máquina de escrever na Home. Deixe vazio para exibir só a Headline.
          </p>

          {form.roles.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {form.roles.map((role) => (
                <span key={role} className="chip">
                  {role}
                  <button type="button" onClick={() => removeRole(role)} aria-label={`Remover ${role}`}>
                    <X size={12} className="text-(--t4) hover:text-red-400" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="mt-3 flex max-w-sm gap-2">
            <input
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyDown={handleRoleKeyDown}
              placeholder="Ex: Engenheiro de Software"
              className="input flex-1"
            />
            <Button type="button" variant="secondary" onClick={addRole}>
              <Plus size={15} />
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <DocumentUploadField
            label="Currículo (PDF)"
            value={form.resumeUrl}
            onChange={(url) => updateField("resumeUrl", url)}
            hint="Aparece como botão de download na Home e em Sobre. Máximo 10MB."
            error={errors.resumeUrl}
          />
        </div>

        <div className="mt-4">
          <Textarea
            label="Bio"
            required
            rows={5}
            value={form.bio}
            onChange={(e) => updateField("bio", e.target.value)}
            error={errors.bio}
          />
        </div>

        <label className="mt-5 flex items-center gap-2.5 text-sm text-(--t2)">
          <input
            type="checkbox"
            checked={form.availableForWork}
            onChange={(e) => updateField("availableForWork", e.target.checked)}
            className="h-4 w-4 accent-brand-500"
          />
          Disponível para novas oportunidades
          <span className="text-xs text-(--t4)">(exibe o selo "Disponível" no site público)</span>
        </label>

        <div className="mt-6 flex items-center gap-4">
          <Button type="submit" isLoading={updateProfile.isPending}>
            Salvar alterações
          </Button>
          {feedback && <span className="text-sm text-(--t4)">{feedback}</span>}
        </div>
      </form>
    </div>
  );
}