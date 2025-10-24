import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TasksModule } from './tasks/tasks.module'
import { AuthModule } from './auth/auth.module'
import { HealthController } from './health.controller'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:pass@localhost:5672'],
          queue: 'auth_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'TASKS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:pass@localhost:5672'],
          queue: 'tasks_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:pass@localhost:5672'],
          queue: 'notification_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      AuthModule,
      TasksModule,
    ]),
  ],

  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
