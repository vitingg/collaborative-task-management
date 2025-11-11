import { Button } from "@/components/ui/button";
import { redirect, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationMenu } from "@/components/notifications-menu";
import { LogOut } from "lucide-react";
import { getInitials } from "@/lib/get-initials";

export function Header() {
  const { logout, user } = useAuthStore();

  if (!user) {
    redirect({ to: "/login" });
  }

  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between">
      <span>
        <p className="text-2xl font-bold pb-1">Bem-vindo de volta!</p>
        <p className="text-lg text-zinc-400">
          Aqui está uma lista de suas tarefas desse mês.
        </p>
      </span>
      <div className="flex items-center gap-4">
        <NotificationMenu />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size={"icon"}
              className="rounded-full cursor-pointer"
            >
              {getInitials(user ? user.username : "UNAVAILABLE")}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={() => {
                logout();
                navigate({ to: "/login" });
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
