import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://admin:admin@rabbitmq:5672"],
        queue: "tasks_queue",
        queueOptions: {
          durable: true,
        },
      },
    }
  );
  await app.listen();
  console.log("Notifications service working...");
}
bootstrap();
