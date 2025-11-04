import { Timer, CircleCheckBig, Eye, Circle } from "lucide-react";

type Status = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

export function status(status: Status) {
  const statusIcon: Record<Status, { label: string; icon: React.ElementType }> =
    {
      TODO: { label: "A fazer", icon: Circle },
      IN_PROGRESS: { label: "Em progresso", icon: Timer },
      REVIEW: { label: "Em análise", icon: Eye },
      DONE: { label: "Realizado", icon: CircleCheckBig },
    };
  const { icon: Icon, label } = statusIcon[status];

  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="size-4" />
      <p>{label}</p>
    </div>
  );
}
