import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Task } from "./task.entity";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  content: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "task_id", type: "uuid" })
  taskId: string;

  @ManyToOne(() => Task, (task) => task.comments)
  @JoinColumn({ name: "task_id" })
  task: Task;
}
