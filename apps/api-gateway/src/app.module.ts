import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { HealthController } from './health.controller'
import { TasksModule } from './tasks/tasks.module'
import { NotificationModule } from './comment/comment.module'

@Module({
  imports: [AuthModule, TasksModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
