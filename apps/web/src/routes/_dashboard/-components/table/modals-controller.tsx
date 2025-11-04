import type { Dispatch, SetStateAction } from "react";
import { AuditLogsModal } from "./table-detail/audit-log/audit-logs-modal";
import { AllDataModal } from "./table-detail/details/all-data-modal";
import { EditTaskSheet } from "./table-detail/edit-task/edit-task-sheet";

type modalsControllerTypes = {
  taskId: string | null;
  editTask: string | null;
  openAuditLogs: string | null;
  setTaskId: Dispatch<SetStateAction<string | null>>;
  setEditTask: Dispatch<SetStateAction<string | null>>;
  setOpenAuditLogs: Dispatch<SetStateAction<string | null>>;
};

export function ModalsController({
  editTask,
  openAuditLogs,
  setEditTask,
  setOpenAuditLogs,
  setTaskId,
  taskId,
}: modalsControllerTypes) {
  return (
    <>
      {taskId && <AllDataModal setTaskId={setTaskId} taskId={taskId} />}
      {editTask && (
        <EditTaskSheet setEditTaskId={setEditTask} editTaskId={editTask} />
      )}
      {openAuditLogs && (
        <AuditLogsModal setOpen={setOpenAuditLogs} taskId={openAuditLogs} />
      )}
    </>
  );
}
