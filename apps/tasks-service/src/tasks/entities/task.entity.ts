import { Comment } from '../../comment/entities/comment.entity'
import { Priority, Status } from '@collab-task-management/types'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { AuditLog } from '../../audit-log/entities/audit-log.entity'

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[]

  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.MEDIUM,
  })
  priority: Priority

  @OneToMany(() => AuditLog, (log) => log.task)
  auditLogs: AuditLog[]

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.TODO,
  })
  status: Status

  @Column({ type: 'uuid' })
  authorId: string

  @Column({ type: 'simple-array', nullable: true })
  assigneesIds: string[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
