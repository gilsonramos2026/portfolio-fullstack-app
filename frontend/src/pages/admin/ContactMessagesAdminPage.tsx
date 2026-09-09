import { useState } from "react";
import toast from "react-hot-toast";
import { Archive, Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { clsx } from "clsx";
import { useContactMessages, useDeleteContactMessage, useUpdateMessageStatus } from "../../hooks/useContactMessages";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatDate } from "../../utils/formatters";
import { CONTACT_STATUS_CLASSES, CONTACT_STATUS_LABEL, type ContactMessage, type ContactMessageStatus } from "../../types/contactMessage";

const FILTERS: { key: ContactMessageStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "Todas" },
  { key: "NEW", label: "Novas" },
  { key: "READ", label: "Lidas" },
  { key: "REPLIED", label: "Respondidas" },
  { key: "ARCHIVED", label: "Arquivadas" },
];

export function ContactMessagesAdminPage() {
  const { data: messages, isLoading } = useContactMessages() as { data: ContactMessage[] | undefined; isLoading: boolean };
  const updateStatus = useUpdateMessageStatus();
  const deleteMessage = useDeleteContactMessage();
  const [filter, setFilter] = useState<ContactMessageStatus | "ALL">("ALL");

  async function handleDelete(id: number) {
    if (!confirm("Excluir esta mensagem?")) return;
    try {
      await deleteMessage.mutateAsync(id);
      toast.success("Mensagem excluída.");
    } catch {
      toast.error("Não foi possível excluir a mensagem.");
    }
  }

  function handleStatusChange(id: number, status: ContactMessageStatus) {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => toast.success(`Marcada como "${CONTACT_STATUS_LABEL[status]}".`),
        onError: () => toast.error("Não foi possível atualizar o status."),
      },
    );
  }

  function handleReply(email: string, name: string, id: number, status: ContactMessageStatus) {
    const subject = encodeURIComponent("Re: contato via portfólio");
    const body = encodeURIComponent(`Olá ${name},\n\n`);
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

    const link = document.createElement("a");
    link.href = mailtoUrl;
    link.click();

    if (status !== "REPLIED") handleStatusChange(id, "REPLIED");
  }

  const filtered = messages?.filter((m: ContactMessage) => filter === "ALL" || m.status === filter);
  const newCount = messages?.filter((m: ContactMessage) => m.status === "NEW").length ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-(--t1)">Mensagens</h1>
      <p className="mt-1 text-sm text-(--t4)">
        {isLoading
          ? "Carregando..."
          : newCount > 0
            ? `${newCount} mensagem${newCount === 1 ? "" : "s"} nova${newCount === 1 ? "" : "s"}.`
            : "Tudo em dia — nenhuma mensagem nova."}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={clsx(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              filter === f.key
                ? "border-brand-500 bg-brand-500 text-white"
                : "border-(--bd) text-(--t3) hover:border-(--bd2) hover:text-(--t1)",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : filtered?.length ? (
          <div className="flex flex-col gap-3">
            {filtered.map((msg: ContactMessage) => (
              <div
                key={msg.id}
                className={clsx("card p-5", msg.status === "NEW" && "border-brand-500/40")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-(--t1)">{msg.name}</p>
                      <span
                        className={clsx(
                          "rounded-full border px-2 py-0.5 text-xs font-medium",
                          CONTACT_STATUS_CLASSES[msg.status],
                        )}
                      >
                        {CONTACT_STATUS_LABEL[msg.status]}
                      </span>
                    </div>
                    <a href={`mailto:${msg.email}`} className="text-sm text-(--t4) hover:text-brand-400">
                      {msg.email}
                    </a>
                  </div>
                  <span className="shrink-0 text-xs text-(--t5)">{formatDate(msg.createdAt)}</span>
                </div>

                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-(--t2)">{msg.message}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleReply(msg.email, msg.name, msg.id, msg.status)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-(--bd) px-3 py-1.5 text-xs font-medium text-(--t2) transition-colors hover:border-brand-500 hover:text-(--t1)"
                  >
                    <Reply size={13} /> Responder por e-mail
                  </button>

                  {msg.status === "NEW" && (
                    <button
                      onClick={() => handleStatusChange(msg.id, "READ")}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-(--bd) px-3 py-1.5 text-xs font-medium text-(--t2) transition-colors hover:border-brand-500 hover:text-(--t1)"
                    >
                      <MailOpen size={13} /> Marcar como lida
                    </button>
                  )}

                  {msg.status !== "ARCHIVED" && (
                    <button
                      onClick={() => handleStatusChange(msg.id, "ARCHIVED")}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-(--bd) px-3 py-1.5 text-xs font-medium text-(--t4) transition-colors hover:border-(--bd2) hover:text-(--t2)"
                    >
                      <Archive size={13} /> Arquivar
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-(--bd) px-3 py-1.5 text-xs font-medium text-(--t4) transition-colors hover:border-red-500/40 hover:text-red-400"
                  >
                    <Trash2 size={13} /> Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-(--bd) p-10 text-center">
            <Mail size={28} className="mx-auto mb-3 text-(--t5)" />
            <p className="text-sm text-(--t4)">
              {filter === "ALL" ? "Nenhuma mensagem recebida ainda." : "Nenhuma mensagem nesse filtro."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}