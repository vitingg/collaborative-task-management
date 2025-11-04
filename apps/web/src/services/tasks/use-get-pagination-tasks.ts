import { useQuery } from "@tanstack/react-query";
import { publicApi } from "../public-api";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { TasksData } from "@/types/tasks/get-pagination-tasks";

type paginationParams = {
  page: string;
  size: string;
};
async function getTasks({ page, size }: paginationParams) {
  const response = await publicApi<TasksData>(
    `tasks?page=${page}&size=${size}`
  );
  return response.data;
}

export function useGetPaginationTasks({ page, size }: paginationParams) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_TASKS, page, size],
    queryFn: () => getTasks({ page, size }),
    enabled: !!page && !!size,
  });
}
