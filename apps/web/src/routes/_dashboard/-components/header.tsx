import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between">
      <span>
        <p className="text-2xl font-bold pb-1">Bem-vindo de volta!</p>
        <p className="text-lg text-zinc-400">
          Aqui está uma lista de suas tarefas desse mês.
        </p>
      </span>
      <span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"} className="rounded-full cursor-pointer">
              VG
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Perfil</DropdownMenuLabel>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                logout();
                navigate({ to: "/login" });
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </span>
    </div>
  );
}
