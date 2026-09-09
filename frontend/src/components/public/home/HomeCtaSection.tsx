import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, Mail } from "lucide-react";
import { FadeIn } from "../../ui/FadeIn";

interface HomeCtaSectionProps {
  linkedinUrl?: string;
}

export function HomeCtaSection({ linkedinUrl }: HomeCtaSectionProps) {
  return (
    <FadeIn>
      <section className="mb-8 border-t border-(--bd) py-14">
        <motion.div
          className="relative overflow-hidden rounded-2xl border p-8 text-center sm:p-14"
          style={{
            borderColor: "rgba(14,165,233,0.3)",
            background: "linear-gradient(135deg, rgba(14,165,233,0.07), rgba(139,92,246,0.07))",
          }}
          whileHover={{ scale: 1.005 }}
        >
          <div
            className="pointer-events-none absolute left-1/4 top-0 h-64 w-64 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, #0ea5e9, transparent)",
              filter: "blur(60px)",
              transform: "translateY(-50%)",
            }}
          />
          <div
            className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full opacity-15"
            style={{
              background: "radial-gradient(circle, #8b5cf6, transparent)",
              filter: "blur(60px)",
              transform: "translateY(50%)",
            }}
          />

          <div className="relative z-10">
            <h2 className="mb-3 text-2xl font-bold text-(--t1) sm:text-3xl">Vamos trabalhar juntos?</h2>
            <p className="mx-auto mb-8 max-w-lg text-sm text-(--t3) sm:text-base">
              Estou disponível para oportunidades como desenvolvedor(a) júnior, projetos freelance e
              colaborações. Vamos criar algo incrível?
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/contato" className="btn-primary">
                  <Mail size={16} /> Entrar em contato
                </Link>
              </motion.div>
              {linkedinUrl && (
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <a href={linkedinUrl} target="_blank" rel="noreferrer noopener" className="btn-outline">
                    <ExternalLink size={16} /> LinkedIn
                  </a>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </section>
    </FadeIn>
  );
}