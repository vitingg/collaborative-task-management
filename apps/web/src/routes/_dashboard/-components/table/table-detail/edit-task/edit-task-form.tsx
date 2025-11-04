import { useForm, Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserProperties } from "@collab-task-management/types";
import type { getOneTaskTypes } from "@/types/tasks/get-one-task";
import type { createTaskTypes } from "@/types/tasks/create-task";
import { usePutTask } from "@/services/tasks/use-put-task";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

type EditTaskFormProps = {
  task: getOneTaskTypes;
  allUsers: UserProperties[];
  onClose: () => void;
};

type TaskFormData = createTaskTypes;

export function EditTaskForm({ task, allUsers, onClose }: EditTaskFormProps) {
  const { mutate: updateTask, isPending } = usePutTask();
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, control } = useForm<TaskFormData>({
    defaultValues: {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      deadline: task.deadline
        ? new Date(task.deadline).toISOString().split("T")[0]
        : "00-00-0000",
      assigneesIds:
        (task.assignees?.map((user) => user?.id).filter(Boolean) as string[]) ||
        [],
    },
  });

  function onSubmit(data: TaskFormData) {
    const payload = {
      ...data,
      deadline: data.deadline
        ? new Date(data.deadline).toISOString().split("T")[0]
        : undefined,
    };
    console.log(payload);

    updateTask(
      { taskId: task.id, payload: payload },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-4">
      <fieldset>
        <Label htmlFor="title" className="pb-2">
          Título
        </Label>
        <Input id="title" {...register("title")} />
      </fieldset>

      <fieldset>
        <Label htmlFor="description" className="pb-2">
          Descrição
        </Label>
        <Textarea id="description" {...register("description")} />
      </fieldset>

      <div className="flex gap-3">
        <div className="flex flex-col gap-3">
          <Label className="px-1">Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="TODO">Pendente</SelectItem>
                    <SelectItem value="IN_PROGRESS">Em progresso</SelectItem>
                    <SelectItem value="REVIEW">Em revisão</SelectItem>
                    <SelectItem value="DONE">Concluída</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="date" className="px-1">
            Prazo (Deadline)
          </Label>
          <Controller
            name="deadline"
            control={control}
            render={({ field }) => (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-40 justify-between font-normal"
                  >
                    {field.value
                      ? new Date(field.value).toLocaleDateString()
                      : "Selecione"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      field.onChange(date);
                      setOpen(false);
                    }}
                    disabled={{
                      before: new Date(),
                    }}
                    className="rounded-lg border shadow-sm"
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>
      </div>

      <fieldset className="space-y-2">
        <Label>Atribuir a:</Label>
        <Controller
          control={control}
          name="assigneesIds"
          render={({ field }) => (
            <div className="space-y-2 rounded-md border p-4 max-h-40 overflow-y-auto">
              {allUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-2">
                  <Checkbox
                    id={user.id}
                    checked={field.value?.includes(user.id)}
                    onCheckedChange={(isChecked) => {
                      const currentIds = field.value || [];
                      if (isChecked) {
                        field.onChange([...currentIds, user.id]);
                      } else {
                        field.onChange(
                          currentIds.filter((id) => id !== user.id)
                        );
                      }
                    }}
                  />
                  <Label htmlFor={user.id} className="font-normal">
                    {user.username} ({user.email})
                  </Label>
                </div>
              ))}
            </div>
          )}
        />
      </fieldset>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
}
