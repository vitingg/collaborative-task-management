import { ClientsModule, Transport } from '@nestjs/microservices'
import { TasksControllers } from './tasks.controller'
import { Module } from '@nestjs/common'

@Module({
  imports: [
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
  controllers: [TasksControllers],
  providers: [],
})
export class TasksModule {}
