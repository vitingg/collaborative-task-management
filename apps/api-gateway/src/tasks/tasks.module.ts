import { Module } from '@nestjs/common'
import { TasksControllers } from './tasks.controller'
import { TasksService } from './tasks.service'

@Module({
  imports: [],
  controllers: [TasksControllers],
  providers: [TasksService],
})
export class TasksModule {}
