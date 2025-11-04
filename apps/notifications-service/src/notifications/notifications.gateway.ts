import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "http://localhost:5173",
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;
}
