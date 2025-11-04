export type createTaskTypes = {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: string;
  deadline: Date;
  assigneesIds?: string[];
};
