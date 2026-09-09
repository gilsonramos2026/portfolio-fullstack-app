import { useInView } from "react-intersection-observer";
import { clsx } from "clsx";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  /** Atraso em ms — use incrementos (0, 80, 160...) para revelar listas em cascata. */
  delay?: number;
  className?: string;
}

/**
 * Revela o conteúdo com fade + leve deslocamento vertical assim que ele
 * entra na viewport. `triggerOnce` evita que a animação repita ao rolar
 * para cima e para baixo — o efeito é "a página ganhando vida" na
 * primeira leitura, não um carrossel de reentrada.
 */
export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <div
      ref={ref}
      className={clsx(
        "transition-all duration-700 ease-out",
        inView ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
