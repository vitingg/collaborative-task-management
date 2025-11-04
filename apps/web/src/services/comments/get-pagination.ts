import type { getCommentsType } from "@/types/comments/get-comments";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "../public-api";

type getCommentsProps = {
  id: string;
  page: string;
  size: string;
};

async function getComments({ id, page, size }: getCommentsProps) {
  const response = await publicApi.get<getCommentsType>(
    `tasks/${id}/comments?page=${page}&size=${size}`
  );
  return response.data;
}

export function usePaginationComments({ id, page, size }: getCommentsProps) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PAGINATION_COMMENTS],
    queryFn: () => getComments({ id, page, size }),
    enabled: !!id,
  });
}
