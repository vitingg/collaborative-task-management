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
import { AuditLogService, CreateLogDto } from '../audit-log/audit-log.service'

type createTaskPayload = {
  authorId: string
  taskData: CreateTaskDto
}

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @Inject('TASKS_SERVICE') private readonly rabbitClient: ClientProxy,
    private readonly auditLogService: AuditLogService
  ) {}

  async create(payload: createTaskPayload): Promise<Task> {
    const { authorId, taskData } = payload
    const newTaskData = {
      ...taskData,
      authorId: authorId,
    }

    const newTask = this.taskRepository.create(newTaskData)
    const saved = this.taskRepository.save(newTask)

    await this.auditLogService.create({
      fieldChanged: 'task',
      oldValue: null,
      newValue: 'created',
      userId: (await saved).authorId,
      taskId: (await saved).id,
    })
    this.rabbitClient.emit('task.created', saved)
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
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: {
        auditLogs: true,
      },
      order: {
        auditLogs: {
          createdAt: 'DESC',
        },
      },
    })

    if (!task) {
      throw new NotFoundException('Task not found!')
    }

    if (task.auditLogs && Array.isArray(task.auditLogs)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      task.auditLogs = task.auditLogs.map((log) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { taskId, ...restOfLog } = log
        return restOfLog
      }) as any
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
    const logsToCreate: CreateLogDto[] = []

    for (const key of Object.keys(taskData)) {
      if (taskData[key] !== undefined && task[key] !== taskData[key]) {
        logsToCreate.push({
          fieldChanged: key,
          oldValue: String(task[key]),
          newValue: String(taskData[key]),
          userId: authorId,
          taskId: taskId,
        })
      }
    }

    if (logsToCreate.length > 0) {
      await this.auditLogService.createMany(logsToCreate)
    }

    const updateTask = this.taskRepository.merge(task, taskData)
    this.taskRepository.save(updateTask)
    this.rabbitClient.emit('task.updated', updateTask)
    return this.findOne(taskId)
  }

  async remove(id: string) {
    return this.taskRepository.delete(id)
  }
}
