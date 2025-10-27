import { CreateCommentDto } from '@collab-task-management/types'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ) {}
  create(createNotificationDto: CreateCommentDto) {
    return 'This action adds a new notification'
  }

  findAll() {
    return `This action returns all notifications`
  }
}
