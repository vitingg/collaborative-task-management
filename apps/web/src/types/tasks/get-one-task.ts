export interface getOneTaskTypes {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  auditLogs: AuditLog[];
  status: Status;
  authorId: string;
  assigneesIds: string[];
  createdAt: string;
  updatedAt: string;
}

type Status = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

export interface AuditLog {
  id: string;
  fieldChanged: string;
  oldValue?: string;
  newValue: string;
  userId: string;
  taskId: string;
  createdAt: string;
}
