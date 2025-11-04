import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AuditLog } from './entities/audit-log.entity'

export type CreateLogDto = {
  fieldChanged: string
  oldValue: string | null
  newValue: string
  userId: string
  taskId: string
}

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>
  ) {}

  async create(logData: CreateLogDto): Promise<AuditLog> {
    const newLog = this.auditLogRepository.create(logData)
    return this.auditLogRepository.save(newLog)
  }

  async createMany(logsData: CreateLogDto[]): Promise<AuditLog[]> {
    const newLogs = this.auditLogRepository.create(logsData)
    return this.auditLogRepository.save(newLogs)
  }
}
