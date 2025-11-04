import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { privateApi } from "../private-api";
import { toast } from "react-toastify";

export function useCreateComment({ taskId }: { taskId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: string) => {
      return privateApi.post(`tasks/${taskId}/comments`, { comment: comment });
    },
    onSuccess: () => {
      toast.success("Comentário criado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TASK, taskId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PAGINATION_COMMENTS, taskId],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
