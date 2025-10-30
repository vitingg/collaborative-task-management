import { ClientProxy } from '@nestjs/microservices'
import {
  CreateTaskDto,
  type UpdateTaskDto,
} from '@collab-task-management/types'
import { lastValueFrom } from 'rxjs'
import { PaginationDto } from '@collab-task-management/types'
import {
  Body,
  Controller,
  Inject,
  Post,
  Get,
  Put,
  Delete,
  Query,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt.auth.guard'

interface Requests {
  user: {
    id: string
    email: string
  }
}

@Controller('tasks')
export class TasksControllers {
  constructor(
    @Inject('TASKS_SERVICE') private readonly taskClient: ClientProxy
  ) {}

  @Post()
  async createTask(@Body() taskData: CreateTaskDto) {
    const newService: CreateTaskDto = await lastValueFrom(
      this.taskClient.send('create_task', taskData)
    )
    return newService
  }

  @Get(':id')
  async getOneTask(@Param('id') taskId: string) {
    const getAllService: CreateTaskDto[] = await lastValueFrom(
      this.taskClient.send('get_one_task', taskId)
    )
    return getAllService
  }

  @Get()
  async allTasks(@Query() paginationDto: PaginationDto) {
    const getAllService: CreateTaskDto[] = await lastValueFrom(
      this.taskClient.send('get_all_tasks', paginationDto)
    )
    return getAllService
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateTask(
    @Req() req: Requests,
    @Param('id') taskId: string,
    @Body() taskData: UpdateTaskDto
  ) {
    const authorId = req.user.id
    console.log(authorId)
    const payload = {
      taskId,
      taskData,
      authorId,
    }
    const update: UpdateTaskDto = await lastValueFrom(
      this.taskClient.send('update_task', payload)
    )
    return update
  }

  @Delete(':id')
  async deleteTask(@Param('id') taskId: string) {
    const deleteTask: CreateTaskDto = await lastValueFrom(
      this.taskClient.send('delete_task', taskId)
    )
    return deleteTask
  }
}
