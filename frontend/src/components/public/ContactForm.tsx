import { useState, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { useSubmitContactMessage } from "@/hooks/useContactMessages";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { AppError } from "@/services/apiClient";

interface FormState {
  name: string;
  email: string;
  message: string;
  website: string; // honeypot
}

const EMPTY_FORM: FormState = { name: "", email: "", message: "", website: "" };

export function ContactForm() {
  const submitMessage = useSubmitContactMessage();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await submitMessage.mutateAsync(form);
      setSent(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError((err as AppError).message);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 size={32} className="text-emerald-400" />
        <p className="font-medium text-(--t1)">Mensagem enviada!</p>
        <p className="text-sm text-(--t4)">Recebi seu contato e respondo o quanto antes.</p>
        <Button variant="ghost" onClick={() => setSent(false)} className="mt-1">
          Enviar outra mensagem
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Nome"
        required
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        placeholder="Como posso te chamar"
      />
      <Input
        label="E-mail"
        type="email"
        required
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        placeholder="voce@empresa.com"
      />
      <Textarea
        label="Mensagem"
        required
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        placeholder="Conte um pouco sobre a oportunidade ou projeto"
      />

      {/* Honeypot anti-spam: invisível para humanos, bots de preenchimento
          automático costumam preencher qualquer campo que encontram. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Deixe este campo em branco</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
        />
      </div>

      <Button type="submit" isLoading={submitMessage.isPending} className="self-start">
        Enviar mensagem
        <Send size={15} />
      </Button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </form>
  );
}
