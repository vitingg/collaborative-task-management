import { useGetPaginationTasks } from "@/services/tasks/use-get-pagination-tasks";
import { ModalsController } from "./table/modals-controller";
import { TableSection } from "./table/table-section";
import { Pagination } from "./table/pagination";
import { HeaderContent } from "./table/header";
import { useState } from "react";

export function Content() {
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [openAuditLogs, setOpenAuditLogs] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [page, setPage] = useState("1");

  const [size, setSize] = useState("10");
  const [search, setSearch] = useState("");
  const { data: TasksResponse, isPending } = useGetPaginationTasks({
    page,
    size,
  });

  function handleSizeChange(newSize: string) {
    setSize(newSize);
    setPage("1");
  }

  const paginationItem = TasksResponse?.meta;

  const filteredTasks =
    TasksResponse?.data.filter((task) =>
      [task.title, task.description, task.status, task.priority]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    ) || [];

  return (
    <div className="space-y-4">
      <HeaderContent search={search} setSearch={setSearch} />
      <TableSection
        isPending={isPending}
        onEditTask={setEditTaskId}
        onOpenAuditLogs={setOpenAuditLogs}
        onShowDetails={setTaskId}
        filteredTasks={filteredTasks}
      />
      <ModalsController
        editTask={editTaskId}
        openAuditLogs={openAuditLogs}
        setEditTask={setEditTaskId}
        setOpenAuditLogs={setOpenAuditLogs}
        setTaskId={setTaskId}
        taskId={taskId}
      />

      {TasksResponse && (
        <Pagination
          page={page}
          setPage={setPage}
          paginationItem={paginationItem}
          size={size}
          onSizeChange={handleSizeChange}
        />
      )}
    </div>
  );
}
