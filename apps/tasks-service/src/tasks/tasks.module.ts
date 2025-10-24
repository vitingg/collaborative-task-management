import { Module } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { TasksController } from "./tasks.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { Comment } from "./entities/comment.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Task, Comment])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
