import { motion } from "framer-motion";
import { Skeleton } from "../../ui/Skeleton";
import { fadeUp, staggerContainer } from "../../../lib/motionVariants";
import { TechIcon } from "../../../utils/techIcons";

interface TechStackSectionProps {
  techStack: string[];
  isLoading: boolean;
}

export function TechStackSection({ techStack, isLoading }: TechStackSectionProps) {
  return (
    <div className="mt-16 border-t border-(--bd) pt-12">
      <h2 className="mb-2 text-xl font-bold text-(--t1)">Tech stack</h2>
      <p className="mb-5 text-sm text-(--t4)">
        Tecnologias efetivamente usadas nos projetos publicados abaixo.
      </p>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))}
        </div>
      ) : techStack.length ? (
        <motion.div
          className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {techStack.map((tech, index) => (
            <motion.div
              key={tech}
              custom={index}
              variants={fadeUp}
              className="chip justify-start px-3.5 py-2.5 text-sm"
            >
              <TechIcon tech={tech} size={17} />
              {tech}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-sm text-(--t4)">Nenhum projeto publicado ainda.</p>
      )}
    </div>
  );
}