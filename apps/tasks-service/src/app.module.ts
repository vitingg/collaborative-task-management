import { Comment } from './comment/entities/comment.entity'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CommentModule } from './comment/comment.module'
import { Task } from './tasks/entities/task.entity'
import { TasksModule } from './tasks/tasks.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { AuditLogModule } from './audit-log/audit-log.module'
import { AuditLog } from './audit-log/entities/audit-log.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',

        host: configService.get<string>('DB_HOST', 'db'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('POSTGRES_USER', 'postgres'),
        password: configService.get<string>('POSTGRES_PASSWORD', 'password'),
        database: configService.get<string>('POSTGRES_DB', 'challenge_db'),
        entities: [Task, Comment, AuditLog],
        synchronize: true, // comentario: true em dev
      }),
    }),
    TasksModule,
    CommentModule,
    AuditLogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
