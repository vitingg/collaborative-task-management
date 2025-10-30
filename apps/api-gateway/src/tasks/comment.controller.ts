import {
  CreateCommentDto,
  type PaginationDto,
} from '@collab-task-management/types'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { JwtAuthGuard } from '../auth/jwt.auth.guard'
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

interface Requests {
  user: {
    id: string
    email: string
  }
}

@Controller('tasks')
export class CommentController {
  constructor(
    @Inject('TASKS_SERVICE') private readonly commentsClient: ClientProxy
  ) {}

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
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
