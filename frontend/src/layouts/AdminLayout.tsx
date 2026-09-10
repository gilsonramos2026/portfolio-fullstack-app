import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sidebar } from "../components/admin/Sidebar";
import { ThemeToggle } from "../components/ui/ThemeToggle";

export function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-dvh bg-(--bg)">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-(--bd) bg-(--s1) md:flex lg:w-60">
        <Sidebar />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <aside className="relative z-10 flex w-60 flex-col border-r border-(--bd) bg-(--s1)">
            <Sidebar onClose={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-(--bd) bg-(--s1) px-4 sm:h-16 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="tap text-(--t3) transition-colors hover:text-(--t1) md:hidden"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu size={20} />
            </button>
            <span className="hidden text-sm font-medium text-(--t3) sm:block">Painel Admin</span>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
