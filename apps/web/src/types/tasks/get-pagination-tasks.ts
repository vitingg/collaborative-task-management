export interface TasksData {
  data: TasksPaginationMeta[];
  meta: TasksPaginationMeta;
}

export interface TasksPaginationMeta {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
  authorId: string;
  assigneesIds: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface TasksPaginationMeta {
  totalItem: number;
  currentPage: string;
  itemsPerPage: string;
  totalPages: number;
}
