import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
}

/** Bloco de skeleton reutilizável — usa os tokens de superfície do tema ativo. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx("animate-pulse rounded-lg bg-(--cb)", className)}
      role="status"
      aria-label="Carregando"
    />
  );
}
