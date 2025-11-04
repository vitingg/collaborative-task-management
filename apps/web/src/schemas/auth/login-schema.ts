import z from "zod";

export const loginSearchSchema = z.object({
  redirect: z.string().optional().catch(""),
});

export const loginSchema = z.object({
  email: z.email({ message: "Email inválido." }),
  password: z.string().min(3, { message: "Senha inválida." }),
});

export type loginSchemaInfer = z.infer<typeof loginSchema>;
