import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Transport, type MicroserviceOptions } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://admin:admin@rabbitmq:5672"],
        queue: "auth_queue",
        queueOptions: {
          durable: true,
        },
      },
    }
  );

  await app.listen();
  console.log("Auth microservice is listening...");
}
bootstrap();
