import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FooterCard } from "../-components/footer-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/services/auth/use-login";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  loginSchema,
  loginSearchSchema,
  type loginSchemaInfer,
} from "@/schemas/auth/login-schema";

export const Route = createFileRoute("/_auth/_layout/login")({
  validateSearch: loginSearchSchema,
  component: Login,
});

function Login() {
  const { login } = useAuthStore();
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { mutate: loginMutate } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginSchemaInfer>({
    resolver: zodResolver(loginSchema),
  });

  const emailError = errors.email?.message;
  const passwordError = errors.password?.message;

  function onFormSubmit(data: loginSchemaInfer) {
    loginMutate(data, {
      onSuccess: (data) => {
        login({
          user: data.user,
          token: data.token,
          refresh: data.refresh,
        });
        toast.success("Login realizado com sucesso!");
        navigate({
          to: redirect || "/dashboard",
          replace: true,
        });
      },
      onError: (error) => {
        toast.error("Falha ao tentar logar...");
        console.log(error);
      },
    });
  }

  return (
    <div className="w-full flex flex-col gap-12 px-24">
      <Card>
        <CardHeader>
          <CardTitle>Acesse o portal</CardTitle>
          <CardDescription>
            Entre usando seu e-mail e senha cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="flex flex-col gap-4 pt-4"
          >
            <fieldset className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="text" {...register("email")} />
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
            </fieldset>
            <fieldset className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input type="password" {...register("password")} />
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
            </fieldset>

            <Button className="w-full">Salvar</Button>
          </form>
        </CardContent>
      </Card>
      <FooterCard
        title="Ainda não tem uma conta?"
        description="Cadastre agora mesmo"
        isRegister={false}
      />
    </div>
  );
}
