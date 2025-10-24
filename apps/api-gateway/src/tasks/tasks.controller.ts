import { Body, Controller, Post } from '@nestjs/common'
import { RegisterUserDto } from '@collab-task-management/types'
import { TasksService } from './tasks.service'

@Controller()
export class TasksControllers {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(@Body() taskData: RegisterUserDto) {
    return this.tasksService.createTask(taskData)
  }
}
