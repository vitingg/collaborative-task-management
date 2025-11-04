import { useGetTask } from "@/services/tasks/use-get-task";
import { type Dispatch, type SetStateAction } from "react";
import type { AuditLog } from "@/types/tasks/get-one-task";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/date";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AuditLogsModalProps = {
  taskId: string;
  setOpen: Dispatch<SetStateAction<string | null>>;
};

function formatAuditLogMessage(log: AuditLog): string {
  let formattedDate: string;
  try {
    formattedDate = formatDate(log.createdAt);
  } catch (error) {
    formattedDate = new Date(log.createdAt).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
    console.error("Erro ao formatar data do log:", error);
  }

  switch (log.fieldChanged) {
    case "task":
      if (log.newValue === "created") {
        return `Tarefa criada em ${formattedDate}.`;
      }
      return `Campo "task" foi atualizado em ${formattedDate}. (De "${
        log.oldValue || "N/A"
      }" para "${log.newValue || "N/A"}")`;

    case "assigneesIds":
      return `Membros responsáveis foram atualizados em ${formattedDate}.`;

    case "deadline": {
      const oldDate = log.oldValue
        ? formatDate(log.oldValue, "dd/MM/yy")
        : "N/A";
      const newDate = log.newValue
        ? formatDate(log.newValue, "dd/MM/yy")
        : "N/A";
      return `Prazo alterado de "${oldDate}" para "${newDate}" em ${formattedDate}.`;
    }

    case "status":
      return `Status alterado de "${log.oldValue || "N/A"}" para "${
        log.newValue || "N/A"
      }" em ${formattedDate}.`;

    case "priority":
      return `Prioridade alterada de "${log.oldValue || "N/A"}" para "${
        log.newValue || "N/A"
      }" em ${formattedDate}.`;

    default:
      return `Campo "${log.fieldChanged}" foi atualizado em ${formattedDate}. (De "${
        log.oldValue || "N/A"
      }" para "${log.newValue || "N/A"}")`;
  }
}

const LoadingSkeleton = () => (
  <div className="space-y-4 p-3 border rounded-md">
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/6" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  </div>
);

export function AuditLogsModal({ taskId, setOpen }: AuditLogsModalProps) {
  const { data, isPending, isError } = useGetTask({ taskId });

  const sortedLogs = data?.auditLogs
    ? [...data.auditLogs].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <Dialog
      open={!!taskId}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Histórico de Alterações</DialogTitle>
          {isPending && (
            <div>
              <Skeleton className="h-4 w-48 mt-1" />
            </div>
          )}
          {data && !isPending && (
            <DialogDescription>
              Exibindo histórico para a tarefa: {data.title}
            </DialogDescription>
          )}
          {isError && (
            <DialogDescription className="text-red-500">
              Erro ao carregar o histórico da tarefa.
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="py-2">
          {isPending && <LoadingSkeleton />}

          {isError && (
            <div className="text-red-500 text-center py-4">
              Não foi possível carregar os dados de auditoria.
            </div>
          )}

          {!isPending && !isError && data && (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 border rounded-md p-3 bg-muted/50">
              {sortedLogs.length > 0 ? (
                sortedLogs.map((log) => (
                  <p
                    key={log.id}
                    className="text-sm text-muted-foreground border-b border-border/50 pb-2 last:border-b-0"
                  >
                    {formatAuditLogMessage(log)}
                  </p>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic text-center py-4">
                  Nenhum histórico de alterações encontrado para esta tarefa.
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
