import { InjectRepository } from '@nestjs/typeorm'
import { Comment } from './entities/comment.entity'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Task } from '../tasks/entities/task.entity'

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>
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
    console.log(comment)

    const task = await this.taskRepository.findOneBy({
      id: taskId,
    })

    console.log('alooo')

    if (!task) {
      throw new NotFoundException(
        'Don`t find any task with this credentials...'
      )
    }
    console.log('alo')

    const newComment = this.commentRepository.create({
      authorId: authorId,
      comment: comment,
      task: task,
    })

    return this.commentRepository.save(newComment)
  }

  async findAll(payload: { id: string; page: string; size: string }) {
    const { id: taskId } = payload
    const comment = await this.commentRepository.find({
      where: {
        taskId: taskId,
      },
    })
    console.log(comment, payload.id)
    if (!comment) {
      throw new NotFoundException(
        'Don`t find any comment with this credentials...'
      )
    }

    return comment
  }
}
