import type { createTaskTypes } from "@/types/tasks/create-task";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "../private-api";
import { toast } from "react-toastify";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTaskData: createTaskTypes) => {
      return privateApi.post("tasks", newTaskData);
    },

    onSuccess: () => {
      toast.success("Task criada com sucesso!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_TASKS],
      });
    },

    onError: (error) => {
      toast.error("Falha ao criar task.");
      console.error(error);
    },
  });
}
