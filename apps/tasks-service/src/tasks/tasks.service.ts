import { Injectable } from '@nestjs/common'
import { CreateTaskDto, UpdateTaskDto } from '@collab-task-management/types'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Task } from './entities/task.entity'
import { Comment } from './entities/comment.entity'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = this.taskRepository.create(createTaskDto)
    return this.taskRepository.save(newTask)
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find()
  }

  async findOne(taskId: string): Promise<Task> {
    const task = await this.taskRepository.findOneBy({
      id: taskId,
    })
    if (!task) {
      throw new Error('Task not found!')
    }
    return task
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.taskRepository.update(id, updateTaskDto)
    return this.findOne(id)
  }

  async remove(id: string) {
    return this.taskRepository.delete(id)
  }
}
