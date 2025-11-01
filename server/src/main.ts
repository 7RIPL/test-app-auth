import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
    ],
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({
     whitelist: true, 
     forbidNonWhitelisted: true, 
     transform: true 
    }));

    app.useGlobalFilters(new AllExceptionsFilter());

    const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('API для аутентификации пользователей')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
