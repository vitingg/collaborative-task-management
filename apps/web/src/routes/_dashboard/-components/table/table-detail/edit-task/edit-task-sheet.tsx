import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Dispatch, SetStateAction } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTask } from "@/services/tasks/use-get-task";
import { useGetAllUsers } from "@/services/auth/use-get-all-users";

import { EditTaskForm } from "./edit-task-form";

type EditTaskSheetTypes = {
  editTaskId: string;
  setEditTaskId: Dispatch<SetStateAction<string | null>>;
};

export function EditTaskSheet({
  editTaskId,
  setEditTaskId,
}: EditTaskSheetTypes) {
  const { data: task, isPending: isTaskPending } = useGetTask({
    taskId: editTaskId,
  });
  const { data: allUsers, isPending: isUsersPending } = useGetAllUsers();

  function handleOnClose() {
    setEditTaskId(null);
  }

  const isLoading = isTaskPending || isUsersPending;

  return (
    <Sheet
      open={true}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleOnClose();
        }
      }}
    >
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editar Tarefa</SheetTitle>
          <SheetDescription>
            {isLoading ? "Carregando dados..." : `Editando: ${task?.title}`}
          </SheetDescription>
        </SheetHeader>

        <div className="py-4">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          )}

          {!isLoading && task && allUsers && (
            <EditTaskForm
              task={task}
              allUsers={allUsers}
              onClose={handleOnClose}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
