import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Sem isso, o React Router preserva a posição de scroll ao navegar entre
 * páginas (diferente de um site tradicional), o que confunde quem clica
 * de "Projetos" para o detalhe de um projeto e cai no meio da página.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
