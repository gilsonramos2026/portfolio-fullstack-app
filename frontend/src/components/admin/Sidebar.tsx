import { NavLink } from "react-router-dom";
import { clsx } from "clsx";
import {
  Code2,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  User,
  X,
} from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useUnreadContactCount } from "@/hooks/useContactMessages";

const NAV = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, end: true },
  { to: "/admin/perfil", label: "Perfil", Icon: User },
  { to: "/admin/enderecos", label: "Endereços", Icon: MapPin },
  { to: "/admin/curriculo", label: "Currículo", Icon: GraduationCap },
  { to: "/admin/projetos", label: "Projetos", Icon: FolderKanban },
  { to: "/admin/mensagens", label: "Mensagens", Icon: Mail },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const { signOut } = useAdminAuth();
  const { data: unreadCount } = useUnreadContactCount();

  return (
    <>
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-(--bd) px-4 sm:h-16">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-(--color-brand-500)">
            <Code2 size={12} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-(--t1)">Admin</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="tap text-(--t3) hover:text-(--t1) md:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "border border-[rgba(14,165,233,0.3)] bg-[rgba(14,165,233,0.2)] text-(--color-brand-400)"
                  : "text-(--t3) hover:bg-(--cb) hover:text-(--t1)",
              )
            }
          >
            <Icon size={15} className="shrink-0" />
            <span className="flex-1">{label}</span>
            {label === "Mensagens" && !!unreadCount && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-(--color-brand-500) px-1.5 text-xs font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 space-y-0.5 border-t border-(--bd) p-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-(--t4) transition-all hover:text-(--color-brand-400)"
        >
          <ExternalLink size={13} />
          Ver site público
        </a>
        <button
          onClick={signOut}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-(--t3) transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={15} />
          Sair
        </button>
      </div>
    </>
  );
}
