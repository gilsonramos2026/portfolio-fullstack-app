import { TechGrid } from "../../../utils/techIcons";
import { FadeIn } from "../../ui/FadeIn";

interface TechStackSectionProps {
  techStack: string[];
  isLoading: boolean;
}

export function TechStackSection({ techStack, isLoading }: TechStackSectionProps) {
  if (isLoading || !techStack.length) return null;

  return (
    <FadeIn>
      <section className="border-t border-(--bd) py-14">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-(--t4)">
          Stack principal
        </p>
        <TechGrid names={techStack.slice(0, 10)} iconSize={36} />
      </section>
    </FadeIn>
  );
}