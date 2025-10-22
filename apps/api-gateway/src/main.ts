import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.setGlobalPrefix('api'); 

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(3001);
  console.log('API Gateway running on port 3001');
}
bootstrap();