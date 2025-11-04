import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TasksController } from './tasks.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TasksService } from './tasks.service'
import { Task } from './entities/task.entity'
import { ConfigModule } from '@nestjs/config'
import { AuditLogModule } from '../audit-log/audit-log.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Task]),
    AuditLogModule,
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
