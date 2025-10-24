import { Module } from "@nestjs/common";
import { TasksModule } from "./tasks/tasks.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "./tasks/entities/task.entity";
import { Comment } from "./tasks/entities/comment.entity";

@Module({
  imports: [
    TasksModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",

        host: configService.get<string>("DB_HOST", "db"),
        port: configService.get<number>("DB_PORT", 5433),
        username: configService.get<string>("POSTGRES_USER", "postgres"),
        password: configService.get<string>("POSTGRES_PASSWORD", "password"),
        database: configService.get<string>("POSTGRES_DB", "challenge_db"),
        entities: [Task, Comment],
        synchronize: true, // comentario: true em dev
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
