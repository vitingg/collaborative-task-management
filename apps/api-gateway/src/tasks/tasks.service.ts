import { Inject, Injectable } from '@nestjs/common'
import type { ClientProxy } from '@nestjs/microservices'
import { RegisterUserDto } from '@collab-task-management/types'

@Injectable()
export class TasksService {
  constructor(
    @Inject('TASK_SERVICE') private readonly taskServiceClient: ClientProxy
  ) {}

  createTask(createTaskDto: RegisterUserDto) {
    console.log('Enviando evento create_task...')

    this.taskServiceClient.emit('create_task', createTaskDto)
    return { message: 'Sua tarefa está sendo processada!' }
  }
}
