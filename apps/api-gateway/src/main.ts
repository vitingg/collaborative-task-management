import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('API Gateway - Task Management System')
    .setDescription('Documentação central das rotas do Gateway')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  app.enableCors({ origin: 'http://localhost:5173' })

  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3001)
  console.log('API Gateway running on port 3001')
  console.log('Swagger running on http://localhost:3001/api/docs')
}
bootstrap()
