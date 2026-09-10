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
    <div className="mt-16 border-t border-(--bd) pt-12 pb-12">
      <h3 className="mb-8 text-center text-xs font-mono tracking-widest text-(--t4) uppercase">
        Stack Principal
      </h3>

      {isLoading ? (
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap sm:justify-center gap-6 max-w-4xl mx-auto px-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full sm:w-24 rounded-lg" />
          ))}
        </div>
      ) : techStack.length ? (
        <motion.div
          className="grid grid-cols-3 sm:flex sm:flex-wrap sm:justify-center items-start gap-x-4 gap-y-8 sm:gap-x-8 max-w-4xl mx-auto px-4"
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
              className="flex flex-col items-center justify-center gap-2 w-full sm:w-24 text-center"
            >
              <div className="flex h-9 w-9 items-center justify-center">
                <TechIcon tech={tech} size={30} />
              </div>
              <span className="text-xs font-medium text-(--t2) truncate w-full">
                {tech}
              </span>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-sm text-(--t4) text-center">Nenhum projeto publicado ainda.</p>
      )}
    </div>
  );
}