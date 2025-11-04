import { ChevronDown, ChevronRight, ChevronUp, ChevronsUp } from "lucide-react";

type priorityLevels = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export function priority(priority: priorityLevels) {
  const priorityData: Record<
    priorityLevels,
    { label: string; icon: React.ElementType }
  > = {
    LOW: { label: "Baixa", icon: ChevronDown },
    MEDIUM: { label: "Média", icon: ChevronRight },
    HIGH: { label: "Alta", icon: ChevronUp },
    URGENT: { label: "Urgente", icon: ChevronsUp },
  };

  const { icon: Icon, label } = priorityData[priority];

  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="size-4" />
      <p>{label}</p>
    </div>
  );
}
