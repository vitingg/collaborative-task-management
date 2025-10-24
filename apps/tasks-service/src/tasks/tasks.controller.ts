import { TasksService } from "./tasks.service";
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateTaskDto, UpdateTaskDto } from "@collab-task-management/types";

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern({ cmd: "task.create" })
  create(@Payload() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @MessagePattern({ cmd: "task.get.all" })
  findAll() {
    return this.tasksService.findAll();
  }

  @MessagePattern({ cmd: "task.get.one" })
  findOne(@Payload() id: string) {
    return this.tasksService.findOne(id);
  }

  @MessagePattern({ cmd: "task.update" })
  update(@Payload() payload: { id: string; dto: UpdateTaskDto }) {
    return this.tasksService.update(payload.id, payload.dto);
  }

  @MessagePattern({ cmd: "task.delete" })
  remove(@Payload() id: string) {
    return this.tasksService.remove(id);
  }
}
