import { CommentController } from './comment.controller'
import { Comment } from './entities/comment.entity'
import { CommentService } from './comment.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { Task } from '../tasks/entities/task.entity'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Comment, Task]),
    ClientsModule.register([
      {
        name: 'TASKS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@rabbitmq:5672'],
          queue: 'tasks-notifications',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
