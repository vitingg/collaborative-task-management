import { Task } from '../../tasks/entities/task.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text')
  comment: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @Column({ name: 'task_id', type: 'uuid' })
  taskId: string

  @Column({ name: 'author_id', type: 'uuid' })
  authorId: string

  @ManyToOne(() => Task, (task) => task.comments)
  @JoinColumn({ name: 'task_id' })
  task: Task
}
