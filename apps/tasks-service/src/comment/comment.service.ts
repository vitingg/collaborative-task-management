import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { PaginationDto } from '@collab-task-management/types'
import { Task } from '../tasks/entities/task.entity'
import { ClientProxy } from '@nestjs/microservices'
import { Comment } from './entities/comment.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @Inject('TASKS_SERVICE') private readonly rabbitClient: ClientProxy
  ) {}

  async create(payload: {
    taskId: string
    createComment: {
      comment: string
      authorId: string
    }
  }) {
    const { createComment, taskId } = payload
    const { authorId, comment } = createComment

    const task = await this.taskRepository.findOneBy({
      id: taskId,
    })
    if (!task) {
      throw new NotFoundException(
        'Don`t find any task with this credentials...'
      )
    }
    const newComment = this.commentRepository.create({
      authorId: authorId,
      comment: comment,
      task: task,
    })
    const saved = this.commentRepository.save(newComment)
    this.rabbitClient.emit('task.comment.created', newComment)
    return saved
  }

  async findAll(payload: { taskId: string; pagination: PaginationDto }) {
    const { taskId } = payload
    const { page, size } = payload.pagination
    const skip = (page - 1) * size

    const [results, total] = await this.commentRepository.findAndCount({
      where: {
        taskId: taskId,
      },
      take: size,
      skip: skip,
      order: {
        createdAt: 'DESC',
      },
    })

    return {
      data: results,
      meta: {
        totalItem: total,
        currentPage: page,
        itemsPerPage: size,
        totalPages: Math.ceil(total / size),
      },
    }
  }
}
