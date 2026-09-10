import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Code2, Mail } from "lucide-react";
import { clsx } from "clsx";
import { useProfile } from "../../hooks/useProfile";
import { ThemeToggle } from "../ui/ThemeToggle";

const LINKS = [
  { to: "/", label: "Início", end: true },
  { to: "/projetos", label: "Projetos" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: profile } = useProfile();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-(--bd) bg-(--s1)/90 shadow-lg backdrop-blur-md" : "bg-transparent",
      )}
    >
      <nav className="content-container flex h-14 items-center justify-between gap-4 sm:h-16">
        <Link to="/" onClick={() => setOpen(false)} className="group flex shrink-0 items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 transition-colors group-hover:bg-brand-400 sm:h-8 sm:w-8">
            <Code2 size={14} className="text-white" />
          </div>
          <span className="text-base font-semibold text-(--t1) sm:text-lg">
            {profile?.fullName?.split(" ")[0] ?? "Dev"}
          </span>
        </Link>

        <ul className="hidden list-none items-center gap-6 md:flex lg:gap-8">
          {LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) => clsx("nav-link", isActive && "active")}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link to="/contato" className="btn-primary px-4 py-2 text-sm">
            <Mail size={14} /> Falar comigo
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="tap text-(--t3) transition-colors hover:text-(--t1)"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <div
        className={clsx(
          "overflow-hidden transition-all duration-300 md:hidden",
          open ? "max-h-72 opacity-100" : "pointer-events-none max-h-0 opacity-0",
        )}
      >
        <div className="space-y-1 border-b border-(--bd) bg-(--s1)/95 px-4 pb-4 pt-2 backdrop-blur-md">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                clsx(
                  "tap w-full justify-start rounded-xl px-3 text-sm font-medium transition-colors",
                  isActive ? "bg-(--cb) text-(--t1)" : "text-(--t3) hover:bg-(--cb) hover:text-(--t1)",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="border-t border-(--bd) pt-2">
            <Link
              to="/contato"
              onClick={() => setOpen(false)}
              className="btn-primary w-full justify-center text-sm"
            >
              <Mail size={14} /> Falar comigo
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
