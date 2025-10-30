import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { HealthController } from './health.controller'
import { TasksModule } from './tasks/tasks.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    AuthModule,
    TasksModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
