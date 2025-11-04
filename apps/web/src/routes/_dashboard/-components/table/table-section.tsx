import { Skeleton } from "@/components/ui/skeleton";
import { sliceTaskId } from "@/lib/task-id";
import { priority } from "@/lib/priority";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import type { TasksPaginationMeta } from "@/types/tasks/get-pagination-tasks";
import { status } from "@/lib/status";
import { Dropdown } from "./table-detail/dropdown-menu";

type tableSectionProps = {
  isPending: boolean;
  filteredTasks: TasksPaginationMeta[];
  onShowDetails: (value: string) => void;
  onEditTask: (value: string) => void;
  onOpenAuditLogs: (value: string) => void;
};

export function TableSection({
  filteredTasks,
  isPending,
  onEditTask,
  onOpenAuditLogs,
  onShowDetails,
}: tableSectionProps) {
  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>Id da tarefa</TableHead>
          <TableHead>Titulo</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Prioridade</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isPending &&
          Array.from({ length: 5 }).map((_, i) => {
            return (
              <TableRow key={i}>
                <TableCell colSpan={6}>
                  <Skeleton key={i} className="w-full h-12" />
                </TableCell>
              </TableRow>
            );
          })}
        {!isPending &&
          filteredTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{sliceTaskId(task.id)}</TableCell>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{status(task.status)}</TableCell>
              <TableCell>{priority(task.priority)}</TableCell>
              <TableCell>
                <Dropdown
                  onOpenAuditLogs={() => onOpenAuditLogs(task.id)}
                  onShowDetails={() => onShowDetails(task.id)}
                  onEditTask={() => onEditTask(task.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        {!isPending && filteredTasks.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-gray-500">
              Nenhuma tarefa encontrada
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
