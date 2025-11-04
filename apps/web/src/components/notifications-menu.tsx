import { useSocketStore } from "@/stores/socket-store";
import { Bell, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function NotificationMenu() {
  const { notifications, markAsRead, clearNotifications } = useSocketStore();
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 max-h-96 overflow-y-auto p-0">
        <div className="flex justify-between items-center p-3 border-b">
          <h3 className="font-semibold text-sm">Notificações</h3>
          {notifications.length > 0 && (
            <Button
              variant="link"
              size="sm"
              className="text-xs text-red-500 hover:text-red-400"
              onClick={clearNotifications}
            >
              <Trash2 size={14} className="mr-1" /> Limpar tudo
            </Button>
          )}
        </div>

        <div className="p-2">
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              Nenhuma notificação
            </p>
          ) : (
            <ul>
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`cursor-pointer rounded-md p-3 hover:bg-accent ${
                    !notif.read ? "font-medium" : "text-muted-foreground"
                  }`}
                >
                  <p className="text-sm">{notif.message}</p>
                  <time className="text-xs text-muted-foreground/80">
                    {new Date(notif.createdAt).toLocaleTimeString("pt-BR")}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
