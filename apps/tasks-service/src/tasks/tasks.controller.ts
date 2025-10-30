import { TasksService } from './tasks.service'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import {
  CreateTaskDto,
  UpdateTaskDto,
  type PaginationDto,
} from '@collab-task-management/types'

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern('create_task')
  create(@Payload() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto)
  }

  @MessagePattern('get_all_tasks')
  findAll(@Payload() pagination: PaginationDto) {
    return this.tasksService.findAll(pagination)
  }

  @MessagePattern('get_one_task')
  findOne(@Payload() taskId: string) {
    return this.tasksService.findOne(taskId)
  }

  @MessagePattern('update_task')
  update(
    @Payload()
    payload: {
      taskId: string
      taskData: UpdateTaskDto
      authorId: string
    }
  ) {
    return this.tasksService.update(payload)
  }

  @MessagePattern('delete_task')
  remove(@Payload() id: string) {
    return this.tasksService.remove(id)
  }
}
