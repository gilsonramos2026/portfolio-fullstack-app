import { motion } from "framer-motion";
import type { Skill } from "../../../types/skill";
import { FadeIn } from "../../ui/FadeIn";
import { TechIcon } from "../../../utils/techIcons";


interface SkillsSectionProps {
  skills?: Skill[];
  isLoading: boolean;
}

export function SkillsSection({ skills, isLoading }: SkillsSectionProps) {
  if (isLoading || !skills?.length) return null;

  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const key = skill.category?.trim() || "Outros";
    (acc[key] ??= []).push(skill);
    return acc;
  }, {});

  return (
    <FadeIn className="mt-16 border-t border-(--bd) pt-12">
      <h2 className="mb-8 text-xl font-bold text-(--t1)">Habilidades</h2>
      <div className="grid gap-10 sm:grid-cols-2">
        {Object.entries(skillsByCategory).map(([category, items]) => (
          <div key={category} className="card p-5 sm:p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-(--t4)">
              {category}
            </p>
            <div className="flex flex-col gap-4">
              {items.map((skill) => (
                <div key={skill.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <TechIcon tech={skill.name} size={17} />
                      <span className="font-medium text-(--t2)">{skill.name}</span>
                    </div>
                    <span className="text-xs text-(--t4)">{skill.proficiency}%</span>
                  </div>
                  <div className="skill-bar">
                    <motion.div
                      className="skill-bar-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </FadeIn>
  );
}