import { CheckCircle2, Clock, FolderKanban, Mail, Star } from "lucide-react";
import { useProjects } from "../../hooks/useProjects";
import { useProfile } from "../../hooks/useProfile";
import { useUnreadContactCount } from "../../hooks/useContactMessages";
import { Skeleton } from "../../components/ui/Skeleton";
import { StatCard } from "../../components/admin/StatCard";
import type { Project } from "../../types/project";
import type { Profile } from "../../types/profile";

export function DashboardPage() {
  const { data: allProjects, isLoading: loadingAll } = useProjects({ size: 100 }) as {
    data: { totalElements: number; content: Project[] } | undefined;
    isLoading: boolean;
  };
  const { data: profile, isLoading: loadingProfile } = useProfile() as {
    data: Profile | undefined;
    isLoading: boolean;
  };
  const { data: unreadCount, isLoading: loadingUnread } = useUnreadContactCount() as {
    data: number | undefined;
    isLoading: boolean;
  };

  const total = allProjects?.totalElements;
  const completed = allProjects?.content.filter((p: Project) => p.status === "COMPLETED").length;
  const inProgress = allProjects?.content.filter((p: Project) => p.status === "IN_PROGRESS").length;
  const featuredCount = allProjects?.content.filter((p: Project) => p.featured).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-(--t1)">Dashboard</h1>
      <p className="mt-1 text-sm text-(--t4)">
        {loadingProfile ? (
          <Skeleton className="h-4 w-40" />
        ) : (
          `Bem-vindo(a) de volta, ${profile?.fullName?.split(" ")[0] ?? "Admin"}.`
        )}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total de projetos" value={total} icon={FolderKanban} isLoading={loadingAll} />
        <StatCard label="Concluídos" value={completed} icon={CheckCircle2} isLoading={loadingAll} />
        <StatCard label="Em andamento" value={inProgress} icon={Clock} isLoading={loadingAll} />
        <StatCard label="Em destaque" value={featuredCount} icon={Star} isLoading={loadingAll} />
      </div>

      {!loadingUnread && !!unreadCount && unreadCount > 0 && (
        <a
          href="/admin/mensagens"
          className="card mt-6 flex items-center gap-3 p-4 text-sm font-medium text-(--t1) transition-colors hover:border-brand-500/40"
        >
          <Mail size={16} className="text-brand-400" />
          Você tem {unreadCount} mensagem{unreadCount === 1 ? "" : "s"} não lida{unreadCount === 1 ? "" : "s"} na caixa de contato.
        </a>
      )}

      <div className="card mt-6 p-6">
        <h2 className="text-base font-bold text-(--t1)">Próximos passos</h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-(--t3)">
          <li>• Atualize seus dados pessoais e foto em Perfil.</li>
          <li>• Cadastre os endereços/contatos que devem aparecer no rodapé público.</li>
          <li>• Publique ou edite projetos em Projetos — marque os melhores como destaque.</li>
        </ul>
      </div>
    </div>
  );
}