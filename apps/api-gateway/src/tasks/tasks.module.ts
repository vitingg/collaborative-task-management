import { CommentController } from './comment.controller'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TasksControllers } from './tasks.controller'
import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: 'TASKS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@rabbitmq:5672'],
          queue: 'tasks_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [TasksControllers, CommentController],
  providers: [],
})
export class TasksModule {}
