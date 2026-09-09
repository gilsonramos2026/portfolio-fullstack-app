import { PROJECT_STATUS_LABEL, type ProjectStatus } from "@/types/project";

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(iso),
  );
}

/** Formata uma data ISO (yyyy-MM-dd) como "mar 2023" — usado em Educação/Certificações. */
export function formatMonthYear(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { month: "short", year: "numeric" }).format(new Date(iso));
}

export function statusLabel(status: ProjectStatus): string {
  return PROJECT_STATUS_LABEL[status];
}

export function statusToneClasses(status: ProjectStatus): string {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    case "IN_PROGRESS":
      return "bg-amber-500/15 text-amber-400 border-amber-500/25";
    case "ARCHIVED":
    default:
      return "bg-(--chb) text-(--t4) border-(--chbd)";
  }
}
