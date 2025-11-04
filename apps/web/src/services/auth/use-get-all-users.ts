import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { UserProperties } from "@collab-task-management/types";
import { privateApi } from "../private-api";

type ApiUserResponse = UserProperties[];

export function useGetAllUsers() {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_USERS],
    queryFn: async (): Promise<ApiUserResponse> => {
      const response = await privateApi.get("/auth/users");

      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
