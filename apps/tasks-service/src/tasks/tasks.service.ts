import { InjectRepository } from '@nestjs/typeorm'
import { Task } from './entities/task.entity'
import { Repository } from 'typeorm'
import { ClientProxy } from '@nestjs/microservices'
import {
  CreateTaskDto,
  UpdateTaskDto,
  PaginationDto,
} from '@collab-task-management/types'
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @Inject('TASKS_SERVICE') private readonly rabbitClient: ClientProxy
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = this.taskRepository.create(createTaskDto)
    const saved = this.taskRepository.save(newTask)
    this.rabbitClient.emit('task.created', newTask)
    return saved
  }

  async findAll(pagination: PaginationDto) {
    const { page, size } = pagination
    const skip = (page - 1) * size

    const [results, total] = await this.taskRepository.findAndCount({
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

  async findOne(taskId: string): Promise<Task> {
    const task = await this.taskRepository.findOneBy({
      id: taskId,
    })
    if (!task) {
      throw new NotFoundException('Task not found!')
    }
    return task
  }

  async update(payload: {
    taskId: string
    taskData: UpdateTaskDto
    authorId: string
  }) {
    const { taskData, taskId, authorId } = payload
    const task = await this.taskRepository.findOneBy({ id: taskId })

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not founded.`)
    }
    if (task.authorId !== authorId) {
      throw new ForbiddenException('You don`t have permission to update this..')
    }
    const updateTask = this.taskRepository.merge(task, taskData)
    const saved = this.taskRepository.save(updateTask)
    this.rabbitClient.emit('task.updated', updateTask)
    return saved
  }

  async remove(id: string) {
    return this.taskRepository.delete(id)
  }
}
