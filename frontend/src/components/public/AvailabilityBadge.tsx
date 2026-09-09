import { clsx } from "clsx";

interface AvailabilityBadgeProps {
  available: boolean;
  className?: string;
}

/**
 * Badge de status de disponibilidade — o primeiro sinal que um
 * recrutador procura ao abrir o portfólio. Controlado pelo Admin em
 * Perfil (`availableForWork`).
 */
export function AvailabilityBadge({ available, className }: AvailabilityBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex w-fit items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium",
        available
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          : "border-(--bd) bg-(--cb) text-(--t4)",
        className,
      )}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full", available ? "animate-pulse bg-emerald-400" : "bg-(--t5)")} />
      {available ? "Disponível para oportunidades" : "Não disponível no momento"}
    </span>
  );
}
