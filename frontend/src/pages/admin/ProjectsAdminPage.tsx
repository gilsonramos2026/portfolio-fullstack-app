import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useProjects } from "../../hooks/useProjects";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import { ProjectTable } from "../../components/admin/ProjectTable";


export function ProjectsAdminPage() {
  const { data, isLoading } = useProjects({ size: 50 });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--t1)">Projetos</h1>
          <p className="mt-1 text-sm text-(--t4)">Gerencie o que aparece na vitrine pública.</p>
        </div>
        <Link to="/admin/projetos/novo">
          <Button>
            <Plus size={15} />
            Novo projeto
          </Button>
        </Link>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <ProjectTable projects={data?.content ?? []} />
        )}
      </div>
    </div>
  );
}
