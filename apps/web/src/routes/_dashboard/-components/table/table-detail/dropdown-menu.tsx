import { DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DropdownProps = {
  onShowDetails: () => void;
  onEditTask: () => void;
  onOpenAuditLogs: () => void;
};

export function Dropdown({
  onShowDetails,
  onEditTask,
  onOpenAuditLogs,
}: DropdownProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" aria-label="Open menu" size="icon-sm">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Opções</DropdownMenuLabel>
        <DropdownMenuItem onSelect={onShowDetails}>Detalhes</DropdownMenuItem>
        <DropdownMenuItem onSelect={onEditTask}>Editar tarefa</DropdownMenuItem>
        <DropdownMenuItem onSelect={onOpenAuditLogs}>Histórico</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
