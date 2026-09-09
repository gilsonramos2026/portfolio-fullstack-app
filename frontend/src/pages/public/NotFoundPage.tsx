import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function NotFoundPage() {
  return (
    <motion.div
      className="content-container flex flex-col items-center gap-4 py-32 text-center"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <span className="text-gradient font-mono text-sm">404</span>
      <h1 className="text-2xl font-bold text-(--t1)">Página não encontrada</h1>
      <Link to="/" className="btn-primary mt-2">
        Voltar para o início
      </Link>
    </motion.div>
  );
}
