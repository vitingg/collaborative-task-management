import { CreateTaskDto, UpdateTaskDto } from '@collab-task-management/types'
import { PaginationDto } from '@collab-task-management/types'
import { JwtAuthGuard } from '../auth/jwt.auth.guard'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
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
  Request,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

interface Requests {
  user: {
    id: string
    email: string
  }
}

@ApiTags('Tasks')
@Controller('tasks')
export class TasksControllers {
  constructor(
    @Inject('TASKS_SERVICE') private readonly taskClient: ClientProxy
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cria uma nova tarefa' })
  @ApiResponse({ status: 201, description: 'Tarefa criada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async createTask(@Body() taskData: CreateTaskDto, @Request() req: Requests) {
    const payload = {
      authorId: req.user.id,
      taskData,
    }
    const newService: CreateTaskDto = await lastValueFrom(
      this.taskClient.send('create_task', payload)
    )
    return newService
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma tarefa específica pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da tarefa' })
  @ApiResponse({ status: 200, description: 'Tarefa encontrada' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  async getOneTask(@Param('id') taskId: string) {
    const getAllService: CreateTaskDto[] = await lastValueFrom(
      this.taskClient.send('get_one_task', taskId)
    )
    return getAllService
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as tarefas com paginação' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página' })
  @ApiResponse({ status: 200, description: 'Lista de tarefas retornada' })
  async allTasks(@Query() paginationDto: PaginationDto) {
    const getAllService: CreateTaskDto[] = await lastValueFrom(
      this.taskClient.send('get_all_tasks', paginationDto)
    )
    return getAllService
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza uma tarefa (requer autoria)' })
  @ApiParam({ name: 'id', description: 'ID da tarefa a ser atualizada' })
  @ApiResponse({ status: 200, description: 'Tarefa atualizada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado (usuário não é o autor)',
  })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  async updateTask(
    @Req() req: Requests,
    @Param('id') taskId: string,
    @Body() taskData: UpdateTaskDto
  ) {
    const authorId = req.user.id
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deleta uma tarefa (requer autoria)' })
  @ApiParam({ name: 'id', description: 'ID da tarefa a ser deletada' })
  @ApiResponse({ status: 200, description: 'Tarefa deletada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  async deleteTask(@Param('id') taskId: string) {
    const deleteTask: CreateTaskDto = await lastValueFrom(
      this.taskClient.send('delete_task', taskId)
    )
    return deleteTask
  }
}
