import type { registerSchemaInfer } from "@/schemas/auth/register-schema";
import { useMutation } from "@tanstack/react-query";
import { publicApi } from "../public-api";

export function useRegister() {
  async function register(data: registerSchemaInfer) {
    const response = await publicApi.post<registerSchemaInfer>(
      "/auth/register",
      data
    );
    return response.data;
  }
  return useMutation({
    mutationFn: register,
  });
}
