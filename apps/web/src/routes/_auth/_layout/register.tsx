import { createFileRoute } from "@tanstack/react-router";
import { FooterCard } from "../-components/footer-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const registerSchema = z.object({
  username: z.string().min(3, { message: "Nome de usuário inválido." }),
  email: z.email({ message: "Email inválido." }),
  password: z.string().min(3, { message: "Senha inválida." }),
});

type registerSchemaInfer = z.infer<typeof registerSchema>;

export const Route = createFileRoute("/_auth/_layout/register")({
  component: Register,
});

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerSchemaInfer>({
    resolver: zodResolver(registerSchema),
  });

  const usernameError = errors.username?.message;
  const emailError = errors.email?.message;
  const passwordError = errors.password?.message;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleRegister(data: any) {
    console.log(data);
  }

  return (
    <div className="w-full flex flex-col gap-12 px-24">
      <Card>
        <CardHeader>
          <CardTitle>Crie sua conta</CardTitle>
          <CardDescription>Informe seu nome, e-mail e senha</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="pt-4 flex flex-col gap-4"
            onSubmit={handleSubmit(handleRegister)}
          >
            <fieldset>
              <Label htmlFor="username">Username</Label>
              <Input id="username" {...register("username")} />
              {usernameError && (
                <p className="text-red-500 text-sm">{usernameError}</p>
              )}
            </fieldset>
            <fieldset>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
            </fieldset>
            <fieldset>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
            </fieldset>
            <Button className="w-full">Criar conta</Button>
          </form>
        </CardContent>
      </Card>
      <FooterCard
        title="Já tem uma conta?"
        description="Entre agora mesmo"
        isRegister
      />
    </div>
  );
}
