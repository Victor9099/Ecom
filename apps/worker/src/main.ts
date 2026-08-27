import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(WorkerModule, {
    logger: ['log', 'error', 'warn'],
  });
  Logger.log('worker ready', 'Bootstrap');
  // Keep the composition root resident; outbox/job leasing wires in Story 1.12+.
  setInterval(() => {}, 1 << 30);
}

void bootstrap();
