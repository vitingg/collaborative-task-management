import { CommentController } from './comment.controller'
import { Comment } from './entities/comment.entity'
import { CommentService } from './comment.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { Task } from '../tasks/entities/task.entity'

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Comment, Task])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
