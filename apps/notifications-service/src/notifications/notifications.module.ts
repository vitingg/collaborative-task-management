import { Module } from "@nestjs/common";
import { NotificationsController } from "./notifications.controller";
import { NotificationsGateway } from "./notifications.gateway";

@Module({
  imports: [],
  controllers: [NotificationsController],
  providers: [NotificationsGateway],
})
export class NotificationsModule {}
