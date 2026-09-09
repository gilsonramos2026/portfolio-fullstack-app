import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

interface StatCardProps {
  label: string;
  value: number | string | undefined;
  icon: LucideIcon;
  isLoading?: boolean;
}

export function StatCard({ label, value, icon: Icon, isLoading }: StatCardProps) {
  return (
    <div className="card flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-(--t4)">{label}</span>
        <Icon size={16} className="text-(--color-brand-400)" />
      </div>
      {isLoading ? (
        <Skeleton className="h-8 w-16" />
      ) : (
        <span className="text-3xl font-bold text-(--t1)">{value}</span>
      )}
    </div>
  );
}
