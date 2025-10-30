import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ["amqp://admin:admin@rabbitmq:5672"],
      queue: "tasks-notifications",
      queueOptions: {
        durable: true,
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3001);
  console.log("Notifications service working...");
}
bootstrap();
