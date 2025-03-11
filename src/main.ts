// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getCorsOrigins } from './config/cors.config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: getCorsOrigins(),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    maxAge: 3600
  });
  
  // Validación global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Prefijo global para la API
  app.setGlobalPrefix('api');

  // Configuración de Swagger (opcional, pero recomendado para documentación)
  const config = new DocumentBuilder()
    .setTitle('Services API')
    .setDescription('The services API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Iniciar el servidor
  await app.listen(3000);
  
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();