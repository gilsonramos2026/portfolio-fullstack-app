import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? "Mudar para tema escuro" : "Mudar para tema claro"}
    >
      <span className="theme-knob">
        {isLight ? <Sun size={11} className="text-white" /> : <Moon size={11} className="text-white" />}
      </span>
    </button>
  );
}
