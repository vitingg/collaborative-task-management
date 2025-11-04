import type { createTaskTypes } from "@/types/tasks/create-task";
import { useCreateTask } from "@/services/tasks/use-post-task";
import { Controller, useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectValue,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function AddTaskForm() {
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const { mutate: createTask } = useCreateTask();

  const { register, handleSubmit, control } = useForm<createTaskTypes>({
    defaultValues: {
      title: "",
      description: "",
      deadline: undefined,
      priority: undefined,
    },
  });

  async function onSubmit(data: createTaskTypes) {
    try {
      const { deadline, ...newData } = data;
      const newDate = deadline.toISOString().split("T")[0];
      console.log(newDate);
      if (!user) {
        return;
      }
      const payload = {
        title: newData.title,
        description: newData.description,
        priority: newData.priority,
        status: "TODO",
        deadline: new Date(newDate),
        authorId: user.id,
      };
      createTask(payload, {
        onSuccess: () => {
          toast.success("Tarefa criada com sucesso!");
          setOpen(false);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-medium">Adicionar tarefa</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Adicionar nova tarefa</DialogTitle>
            <DialogDescription>Crie novas tarefas</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Titulo</Label>
              <Input
                id="title"
                placeholder="Adicione seu titulo."
                {...register("title")}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Adicione sua descrição."
                {...register("description")}
              />
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-3">
                <Label htmlFor="priority" className="px-1">
                  Adicione suas prioridades
                </Label>

                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Prioridades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Prioridade</SelectLabel>
                          <SelectItem value="LOW">Baixa</SelectItem>
                          <SelectItem value="MEDIUM">Média</SelectItem>
                          <SelectItem value="HIGH">Alta</SelectItem>
                          <SelectItem value="URGENT">Urgente</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="date" className="px-1">
                  Data de vencimento
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
                          className="w-48 justify-between font-normal"
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
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
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
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Salvar mudanças</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
