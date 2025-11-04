import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Task } from '../../tasks/entities/task.entity'

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'field_changed' })
  fieldChanged: string 

  @Column({ name: 'old_value', type: 'text', nullable: true })
  oldValue: string | null 

  @Column({ name: 'new_value', type: 'text' })
  newValue: string

  @Column({ name: 'user_id' }) 
  userId: string

  @Column({ name: 'task_id' }) 
  taskId: string

  @ManyToOne(() => Task, (task) => task.auditLogs)
  @JoinColumn({ name: 'task_id' })
  task: Task

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}