import { useState } from "react";
import { clsx } from "clsx";
import { SkillManager } from "../../components/admin/SkillManager";
import { EducationManager } from "../../components/admin/EducationManager";
import { CertificationManager } from "../../components/admin/CertificationManager";

const TABS = [
  { key: "skills", label: "Habilidades" },
  { key: "education", label: "Formação" },
  { key: "certifications", label: "Certificações" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function CurriculumAdminPage() {
  const [tab, setTab] = useState<TabKey>("skills");

  return (
    <div>
      <h1 className="text-2xl font-bold text-(--t1)">Currículo</h1>
      <p className="mt-1 text-sm text-(--t4)">
        Habilidades, formação acadêmica e certificações exibidas na página Sobre.
      </p>

      <div className="mt-6 flex gap-1 border-b border-(--bd)">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={clsx(
              "relative px-4 py-2.5 text-sm font-medium transition-colors",
              tab === t.key ? "text-(--t1)" : "text-(--t4) hover:text-(--t2)",
            )}
          >
            {t.label}
            {tab === t.key && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-500" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "skills" && <SkillManager />}
        {tab === "education" && <EducationManager />}
        {tab === "certifications" && <CertificationManager />}
      </div>
    </div>
  );
}
