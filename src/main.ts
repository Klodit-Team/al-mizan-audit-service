import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Configure Swagger Document Builder
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Al-Mizan Audit Service API')
    .setDescription('REST API documentation for the Audit & Traçabilité microservice')
    .setVersion('1.0.0')
    .addTag('audit')
    .addTag('incidents')
    .addTag('decisions')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  
  // Set up Swagger at api/docs (the JSON will be exposed at api/docs-json)
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);
}

void bootstrap();