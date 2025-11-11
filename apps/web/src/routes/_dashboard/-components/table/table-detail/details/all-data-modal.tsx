import { usePaginationComments } from "@/services/comments/get-pagination";
import { type Dispatch, type SetStateAction, useState } from "react";
import type { getCommentsType } from "@/types/comments/get-comments";
import { useCreateComment } from "@/services/comments/post-comment";
import type { getOneTaskTypes } from "@/types/tasks/get-one-task";
import { useGetTask } from "@/services/tasks/use-get-task";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { priority } from "@/lib/priority";
import { formatDate } from "@/lib/date";
import { status } from "@/lib/status";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TaskDetailsProps = {
  data: getOneTaskTypes;
  commentsData: getCommentsType;
  taskId: string;
};

type AllDataModalProps = {
  taskId: string;
  setTaskId: Dispatch<SetStateAction<string | null>>;
};

export function AllDataModal({ setTaskId, taskId }: AllDataModalProps) {
  const { data, isPending, isError } = useGetTask({ taskId });
  const page = "1";
  const size = "10";

  const {
    data: commentsData,
    isPending: commentsPending,
    isError: commentsError,
  } = usePaginationComments({
    id: taskId,
    page,
    size,
  });

  const isLoading = isPending || commentsPending;
  const hasError = isError || commentsError;

  const canRenderDetails = data && commentsData && !isLoading && !hasError;

  const handleClose = () => {
    setTaskId(null);
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
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Tarefa</DialogTitle>
          {isLoading && (
            <div>
              <Skeleton className="h-4 w-40" />
            </div>
          )}
          {hasError && (
            <DialogDescription className="text-red-500">
              Erro ao carregar os detalhes.
            </DialogDescription>
          )}
          {data && !isLoading && (
            <DialogDescription>ID da tarefa: {data.id}</DialogDescription>
          )}
        </DialogHeader>

        <div className="py-2">
          {isLoading && <LoadingSkeleton />}

          {hasError && (
            <div className="text-red-500 text-center py-4">
              Não foi possível carregar os dados da tarefa ou comentários.
            </div>
          )}
          {canRenderDetails && (
            <TaskDetails
              data={data}
              commentsData={commentsData}
              taskId={taskId}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-5 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-5 w-full" />
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-5 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-5 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-5 w-full" />
      </div>
    </div>
  </div>
);

const TaskDetails = ({ data, commentsData, taskId }: TaskDetailsProps) => {
  const { mutate: createComment } = useCreateComment({ taskId });
  const [newComment, setNewComment] = useState("");

  function handleCommentSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(newComment);

    createComment(newComment);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-muted-foreground">
          Título
        </label>
        <p className="text-base">{data.title}</p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-muted-foreground">
          Descrição
        </label>
        <p className="text-base">{data.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">
            Status
          </label>
          <div className="text-base">{status(data.status)}</div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">
            Prioridade
          </label>
          <div className="text-base">{priority(data.priority)}</div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">
            Data de entrega
          </label>
          <p className="text-base">{formatDate(data.deadline)}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4"></div>

      <div className="space-y-4 pt-2">
        <label className="text-sm font-medium text-muted-foreground">
          Comentários
        </label>

        <div className="space-y-2 max-h-32 overflow-y-auto pr-2 border-b pb-2">
          {commentsData.data.length > 0 ? (
            commentsData.data.map((c) => (
              <div key={c.id} className="text-sm border-b pb-2 last:border-b-0">
                <p>{c.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Nenhum comentário encontrado.
            </p>
          )}
        </div>

        <form onSubmit={handleCommentSubmit} className="space-y-3">
          <Label htmlFor="new-comment" className="font-medium">
            Adicionar novo comentário
          </Label>
          <Textarea
            id="new-comment"
            placeholder="Escreva seu comentário..."
            className="min-h-20"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={newComment.trim().length === 0}>
              Publicar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
