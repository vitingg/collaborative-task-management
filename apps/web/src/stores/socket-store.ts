import { socket } from "@/services/socket-io";
import { create } from "zustand";
import { toast } from "react-toastify";

export interface Notification {
  id: string;
  type: "task-created" | "task-updated" | "task-comment-created" | "generic";
  message: string;
  read: boolean;
  createdAt: string;
  payload?: any;
}

interface SocketStore {
  socket: typeof socket;
  isConnected: boolean;
  notifications: Notification[];
  connect: () => void;
  disconnect: () => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket,
  isConnected: false,
  notifications: [],

  connect: () => {
    if (get().isConnected) {
      return;
    }

    socket.on("connect", () => {
      console.log("✅ Socket conectado:", socket.id);
      set({ isConnected: true });
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket desconectado");
      set({ isConnected: false });
    });

    socket.on("task:created", (data: any) => {
      console.log("🔔 Evento 'task:created' recebido:", data);

      const newNotification: Notification = {
        id: data.id,
        type: "task-created",
        message: `Nova tarefa criada: "${data.title || "Sem título"}"`,
        read: false,
        createdAt: new Date().toISOString(),
        payload: data,
      };

      toast.success(newNotification.message);

      set((state) => ({
        notifications: [newNotification, ...state.notifications],
      }));
    });

    socket.on("task:updated", (data: any) => {
      console.log("🔄 Evento 'task:updated' recebido:", data);

      const newNotification: Notification = {
        id: data.id,
        type: "task-updated",
        message: `Tarefa atualizada: "${data.title || "Sem título"}"`,
        read: false,
        createdAt: new Date().toISOString(),
        payload: data,
      };

      toast.info(newNotification.message);

      set((state) => ({
        notifications: [newNotification, ...state.notifications],
      }));
    });

    socket.on("comment:new", (data: any) => {
      console.log("💬 Evento 'comment:new' recebido:", data);

      const newNotification: Notification = {
        id: data.id,
        type: "task-comment-created",
        message: `Novo comentário de ${data.user?.name || "Alguém"}`,
        read: false,
        createdAt: new Date().toISOString(),
        payload: data,
      };

      toast.info(newNotification.message);

      set((state) => ({
        notifications: [newNotification, ...state.notifications],
      }));
    });

    socket.connect();
  },

  disconnect: () => {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("task:created");
    socket.off("task:updated");
    socket.off("comment:new");

    socket.disconnect();
    set({ isConnected: false });
  },

  markAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      ),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },
}));
