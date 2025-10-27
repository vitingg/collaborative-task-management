import { CreateCommentDto } from '@collab-task-management/types'
import { MessagePattern } from '@nestjs/microservices'
import { CommentService } from './comment.service'
import { Controller, Body } from '@nestjs/common'

@Controller()
export class CommentController {
  constructor(private readonly notificationsService: CommentService) {}

  @MessagePattern('task-comment-created')
  create(@Body() createCommentary: CreateCommentDto) {
    return createCommentary
  }

  @MessagePattern('get-all-commented-task')
  findAll() {
    return this.notificationsService.findAll()
  }
}
