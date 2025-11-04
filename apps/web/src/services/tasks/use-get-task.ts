import type { getOneTaskTypes } from "@/types/tasks/get-one-task";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "../public-api";

export function useGetTask({ taskId }: { taskId: string }) {
  async function taskDetails() {
    const response = await publicApi.get<getOneTaskTypes>(`/tasks/${taskId}`);
    return response.data;
  }

  return useQuery({
    queryKey: [QUERY_KEYS.GET_TASK, taskId],
    queryFn: taskDetails,
  });
}
