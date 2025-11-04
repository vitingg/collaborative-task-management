import z from "zod";

export const registerSchema = z.object({
  username: z.string().min(3, { message: "Nome de usuário inválido." }),
  email: z.email({ message: "Email inválido." }),
  password: z.string().min(3, { message: "Senha inválida." }),
});

export type registerSchemaInfer = z.infer<typeof registerSchema>;
