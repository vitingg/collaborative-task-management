import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Comment } from "./comment.entity";

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum Status {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  REVIEW = "REVIEW",
  DONE = "DONE",
}

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "timestamp", nullable: true })
  deadline: Date;

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];

  @Column({
    type: "enum",
    enum: Priority,
    default: Priority.MEDIUM,
  })
  priority: Priority;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.TODO,
  })
  status: Status;

  @Column({ type: "uuid" })
  authorId: string;

  @Column({ type: "simple-array", nullable: true })
  assigneesIds: string[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
