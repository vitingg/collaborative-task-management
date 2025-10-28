import { CreateCommentDto } from '@collab-task-management/types'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { type Request } from 'express'

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
import { JwtAuthGuard } from '../auth/jwt.auth.guard'

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
    if (!req.user) {
      throw new Error('a')
    }
    const authorId = req.user.id

    console.log('Gateway received request to create a commentary.')
    const payload = {
      taskId: taskId,
      createComment: {
        ...createComment,
        authorId,
      },
    }
    const newComment = await lastValueFrom(
      this.commentsClient.send('task-comment-created', payload)
    )

    return newComment
  }

  @Get(':id/comments')
  async getComments(
    @Param('id') id: string,
    @Query('page') page: string,
    @Query('size') size: string
  ) {
    const payload = {
      id: id,
      page: page,
      size: size,
    }
    const getComments: CreateCommentDto[] = await lastValueFrom(
      this.commentsClient.send('get-all-commented-task', payload)
    )
    return getComments
  }
}
