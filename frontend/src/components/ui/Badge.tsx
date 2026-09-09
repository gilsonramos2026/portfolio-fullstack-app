import { clsx } from "clsx";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

/** Badge genérico — para os chips de tecnologia, prefira TechBadge (utils/techIcons). */
export function Badge({ children, className }: BadgeProps) {
  return <span className={clsx("chip", className)}>{children}</span>;
}
