import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";

type FooterCardProps = {
  title: string;
  description: string;
  isRegister: boolean;
};

export function FooterCard({
  title,
  description,
  isRegister,
}: FooterCardProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="secondary"
          className="w-full hover:cursor-pointer"
          onClick={() => {
            navigate({ to: isRegister ? "/login" : "/register" });
          }}
        >
          {isRegister ? "Acessar conta" : "Criar conta"}
        </Button>
      </CardContent>
    </Card>
  );
}
