import { MessagePattern, Payload } from '@nestjs/microservices'
import { CommentService } from './comment.service'
import { Controller } from '@nestjs/common'
import type { PaginationDto } from 'dist'

@Controller()
export class CommentController {
  constructor(private readonly commentsService: CommentService) {}

  @MessagePattern('task-comment-created')
  async create(
    @Payload()
    payload: {
      taskId: string
      createComment: {
        comment: string
        authorId: string
      }
    }
  ) {
    console.log('Microservice received payload:', payload)
    const newComment = await this.commentsService.create(payload)
    return newComment
  }

  @MessagePattern('get-all-commented-task')
  findAll(@Payload() payload: { taskId: string; pagination: PaginationDto }) {
    const findAllComments = this.commentsService.findAll(payload)
    return findAllComments
  }
}
