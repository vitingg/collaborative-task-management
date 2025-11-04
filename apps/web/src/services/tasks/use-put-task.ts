import type { createTaskTypes } from "@/types/tasks/create-task";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "../private-api";
import { toast } from "react-toastify";
import { QUERY_KEYS } from "@/constants/query-keys";

type MutateVariables = {
  taskId: string;
  payload: createTaskTypes;
};

export function usePutTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, payload }: MutateVariables) => {
      return privateApi.put(`tasks/${taskId}`, payload);
    },
    onSuccess: (_, variable) => {
      const { taskId } = variable;
      toast.success("Tarefa atualizada com sucesso");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_TASKS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TASK, taskId],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
