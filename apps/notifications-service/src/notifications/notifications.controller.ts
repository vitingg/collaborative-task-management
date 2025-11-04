import { EventPattern, Payload } from "@nestjs/microservices";
import { Controller } from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { NotificationsGateway } from "./notifications.gateway";

@Controller()
export class NotificationsController {
  constructor(
    @Inject() private readonly notificationsGateway: NotificationsGateway
  ) {}

  @EventPattern("task.created")
  onCreateTask(@Payload() data: any) {
    console.log(data);
    this.notificationsGateway.server.emit("task:created", data);
  }

  @EventPattern("task:updated")
  onUpdatedTask(@Payload() data: any) {
    console.log(data);
    this.notificationsGateway.server.emit("task-updated", data);
  }

  @EventPattern("comment:new")
  onCommentaryCreated(@Payload() data: any) {
    console.log(data);
    this.notificationsGateway.server.emit("task-comment-created", data);
  }
}
