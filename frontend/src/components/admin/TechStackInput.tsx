import { useState, type KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "../ui/Button";

interface ProjectTechStackInputProps {
  techStack: string[];
  onChange: (techs: string[]) => void;
}

export function ProjectTechStackInput({ techStack, onChange }: ProjectTechStackInputProps) {
  const [newTech, setNewTech] = useState("");

  function addTech() {
    const tech = newTech.trim();
    if (!tech || techStack.includes(tech)) return;
    onChange([...techStack, tech]);
    setNewTech("");
  }

  function removeTech(techToRemove: string) {
    onChange(techStack.filter((t) => t !== techToRemove));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTech();
    }
  }

  return (
    <div className="mt-4">
      <span className="text-sm font-medium text-(--t2)">Tech stack do projeto</span>
      <div className="mt-2 flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <span key={tech} className="chip font-mono">
            {tech}
            <button type="button" onClick={() => removeTech(tech)} aria-label={`Remover ${tech}`}>
              <X size={12} className="text-(--t4) hover:text-red-400" />
            </button>
          </span>
        ))}
      </div>
      <div className="mt-3 flex max-w-xs gap-2">
        <input
          value={newTech}
          onChange={(e) => setNewTech(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ex: React, PostgreSQL"
          className="input flex-1"
        />
        <Button type="button" variant="secondary" onClick={addTech}>
          <Plus size={15} />
        </Button>
      </div>
    </div>
  );
}