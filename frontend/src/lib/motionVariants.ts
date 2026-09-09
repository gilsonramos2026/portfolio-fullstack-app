import type { Variants } from "framer-motion";

/** Entrada com leve subida — uso padrão para texto e blocos do hero. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

/** Contêiner que escalona a entrada dos filhos (staggerChildren). */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/** Leve levitação contínua — usada com moderação (ex: foto de perfil). */
export const floatAnimation = {
  y: [0, -10, 0],
};

export const floatTransition = {
  duration: 5,
  repeat: Infinity,
  ease: "easeInOut" as const,
};
