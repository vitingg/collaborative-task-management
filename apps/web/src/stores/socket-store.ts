import { socket } from "@/services/socket-io";
import { create } from "zustand";

interface SocketStore {
  socket: typeof socket;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
  socket,
  isConnected: false,

  connect: () => {
    if (!socket.connected) {
      socket.connect();

      socket.on("connect", () => {
        console.log("✅ Socket conectado:", socket.id);
        set({ isConnected: true });
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket desconectado");
        set({ isConnected: false });
      });
    }
  },

  disconnect: () => {
    socket.disconnect();
    set({ isConnected: false });
  },
}));
