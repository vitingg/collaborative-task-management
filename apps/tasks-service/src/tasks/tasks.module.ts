import { TasksController } from './tasks.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TasksService } from './tasks.service'
import { ConfigModule } from '@nestjs/config'
import { Task } from './entities/task.entity'
import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Task]),
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
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
