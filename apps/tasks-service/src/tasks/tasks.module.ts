import { TasksController } from "./tasks.controller";
import { Comment } from "./entities/comment.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TasksService } from "./tasks.service";
import { ConfigModule } from "@nestjs/config";
import { Task } from "./entities/task.entity";
import { Module } from "@nestjs/common";

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Task, Comment])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
