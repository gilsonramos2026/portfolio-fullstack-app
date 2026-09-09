import { GraduationCap } from "lucide-react";
import { FadeIn } from "../../ui/FadeIn";
import { formatMonthYear } from "../../../utils/formatters";

interface Education {
  id: string | number;
  startDate: string;
  endDate?: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  description?: string;
}

interface EducationSectionProps {
  educations?: Education[];
  isLoading: boolean;
}

export function EducationSection({ educations, isLoading }: EducationSectionProps) {
  if (isLoading || !educations?.length) return null;

  return (
    <FadeIn className="mt-16 border-t border-(--bd) pt-12">
      <h2 className="mb-8 flex items-center gap-2 text-xl font-bold text-(--t1)">
        <GraduationCap size={20} className="text-brand-400" />
        Formação acadêmica
      </h2>
      <div className="flex flex-col gap-8 border-l border-(--bd) pl-6">
        {educations.map((edu) => (
          <div key={edu.id} className="relative">
            <div className="timeline-dot absolute left-[1.72rem] top-1" />
            <p className="text-xs font-mono text-(--t4)">
              {formatMonthYear(edu.startDate)} — {edu.endDate ? formatMonthYear(edu.endDate) : "atual"}
            </p>
            <h3 className="mt-1 font-semibold text-(--t1)">{edu.degree}</h3>
            <p className="text-sm text-(--t3)">
              {edu.institution}
              {edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ""}
            </p>
            {edu.description && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-(--t4)">{edu.description}</p>
            )}
          </div>
        ))}
      </div>
    </FadeIn>
  );
}