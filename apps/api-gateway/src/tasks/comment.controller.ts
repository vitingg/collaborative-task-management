import { CreateCommentDto, PaginationDto } from '@collab-task-management/types'
import { JwtAuthGuard } from '../auth/jwt.auth.guard'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common'
import {
  ApiParam,
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger'

interface Requests {
  user: {
    id: string
    email: string
  }
}

@ApiTags('Tasks / Comments')
@Controller('tasks')
export class CommentController {
  constructor(
    @Inject('TASKS_SERVICE') private readonly commentsClient: ClientProxy
  ) {}

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adiciona um novo comentário a uma tarefa' })
  @ApiParam({ name: 'id', description: 'ID da tarefa que será comentada' })
  @ApiResponse({ status: 201, description: 'Comentário criado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  async createComment(
    @Req() req: Requests,
    @Param('id') taskId: string,
    @Body() createComment: CreateCommentDto
  ) {
    const authorId = req.user.id

    console.log('Gateway received request to create a commentary.')
    const payload = {
      taskId: taskId,
      createComment: {
        ...createComment,
        authorId,
      },
    }
    const newComment: CreateCommentDto = await lastValueFrom(
      this.commentsClient.send('task-comment-created', payload)
    )

    return newComment
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Lista todos os comentários de uma tarefa' })
  @ApiParam({ name: 'id', description: 'ID da tarefa' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página' })
  @ApiResponse({ status: 200, description: 'Lista de comentários retornada' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  async getComments(
    @Param('id') taskId: string,
    @Query() pagination: PaginationDto
  ) {
    const payload = {
      taskId,
      pagination,
    }
    const getComments: CreateCommentDto[] = await lastValueFrom(
      this.commentsClient.send('get-all-commented-task', payload)
    )
    return getComments
  }
}
