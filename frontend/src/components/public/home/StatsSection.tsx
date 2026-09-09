import { motion } from "framer-motion";
import type { GitHubStats } from "../../../hooks/useGitHubStats";
import { FadeIn } from "../../ui/FadeIn";

interface StatsSectionProps {
  projectCount: number;
  techStackLength: number;
  githubStats?: GitHubStats;
}

export function StatsSection({ projectCount, techStackLength, githubStats }: StatsSectionProps) {
  const stats = [
    { v: `${projectCount}+`, l: "Projetos entregues" },
    { v: `${techStackLength}+`, l: "Tecnologias" },
    ...(githubStats
      ? [
          { v: `${githubStats.publicRepos}`, l: "Repos no GitHub" },
          { v: `${githubStats.followers}`, l: "Seguidores GitHub" },
        ]
      : [{ v: "100%", l: "Comprometimento" }]),
  ];

  return (
    <FadeIn>
      <section className="border-t border-(--bd) py-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.l}
              className="card p-5 text-center sm:p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.04 }}
            >
              <p className="text-gradient text-2xl font-bold sm:text-3xl">{s.v}</p>
              <p className="mt-1 text-xs text-(--t4) sm:text-sm">{s.l}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}