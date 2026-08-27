import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Ecom API')
    .setDescription('Ecom platform API — Story 1.1 scaffold (ADR-10 OpenAPI transport source).')
    .setVersion('0.1.0')
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));

  const port = Number(process.env.PORT ?? 3100);
  await app.listen(port);
  Logger.log(`api ready http://localhost:${port}`, 'Bootstrap');
}

void bootstrap();
