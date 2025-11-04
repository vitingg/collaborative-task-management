import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRegister } from "@/services/auth/use-register";
import { FooterCard } from "../-components/footer-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  registerSchema,
  type registerSchemaInfer,
} from "@/schemas/auth/register-schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/_auth/_layout/register")({
  component: Register,
});

function Register() {
  const { mutate: registerMutate } = useRegister();
  const navigate = useNavigate();

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

  async function handleRegister(data: registerSchemaInfer) {
    registerMutate(data, {
      onSuccess: () => {
        toast.success("Conta criada com sucesso!");
        navigate({ to: "/login" });
      },
      onError: (error) => {
        console.log(error);
        toast.error("Houve algum erro na criação de seu usuário!");
      },
    });
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
