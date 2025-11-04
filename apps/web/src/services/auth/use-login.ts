import type { loginSchemaInfer } from "@/schemas/auth/login-schema";
import type { loginUserResponse } from "@/types/auth/login-user";
import { useMutation } from "@tanstack/react-query";
import { publicApi } from "../public-api";

export function useLogin() {
  async function login(data: loginSchemaInfer) {
    const response = await publicApi.post<loginUserResponse>(
      "/auth/login",
      data
    );
    return response.data;
  }
  return useMutation({
    mutationFn: login,
  });
}
