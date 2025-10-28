// import { Module } from "@nestjs/common";
// import {  } from "./notifications/entities";
// import { ConfigModule, ConfigService } from "@nestjs/config";
// import { TypeOrmModule } from "@nestjs/typeorm";

// @Module({
//   imports: [
//     NotificationsModule,
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: ".env",
//     }),
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => ({
//         type: "postgres",

//         host: configService.get<string>("DB_HOST", "db"),
//         port: configService.get<number>("DB_PORT", 5433),
//         username: configService.get<string>("POSTGRES_USER", "postgres"),
//         password: configService.get<string>("POSTGRES_PASSWORD", "password"),
//         database: configService.get<string>("POSTGRES_DB", "challenge_db"),
//         // entities: [Notifications],
//         synchronize: true, // comentario: true em dev
//       }),
//     }),
//   ],
//   controllers: [],
//   providers: [],
// })
// export class AppModule {}
