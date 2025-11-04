import { Input } from "@/components/ui/input";
import { AddTaskForm } from "../header/add-task-form";

type headerContentProps = {
  search: string;
  setSearch: (v: string) => void;
};

export function HeaderContent({ search, setSearch }: headerContentProps) {
  return (
    <span className="flex items-center justify-between">
      <Input
        className="w-64"
        placeholder="Filtrar tarefas..."
        onChange={(e) => setSearch(e.target.value)}
      />
      <AddTaskForm />
    </span>
  );
}
