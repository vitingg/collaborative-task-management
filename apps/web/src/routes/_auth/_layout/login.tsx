import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FooterCard } from "../-components/footer-card";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const Route = createFileRoute("/_auth/_layout/login")({
  component: Login,
});

const loginSchema = z.object({
  email: z.email({ message: "Email inválido." }),
  password: z.string().min(3, { message: "Senha inválida." }),
});

type loginSchemaInfer = z.infer<typeof loginSchema>;

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginSchemaInfer>({
    resolver: zodResolver(loginSchema),
  });

  const emailError = errors.email?.message;
  const passwordError = errors.password?.message;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleLogin(data: any) {
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }
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
            onSubmit={handleSubmit(handleLogin)}
            className="flex flex-col gap-4 pt-4"
          >
            <fieldset>
              <Label htmlFor="email">Email</Label>
              <Input type="text" {...register("email")} />
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
            </fieldset>
            <fieldset>
              <Label htmlFor="password">Password</Label>
              <Input type="password" {...register("password")} />
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
            </fieldset>

            <Button className="w-full">salvar</Button>
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
