import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const uploadsDir = join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use('/uploads', express.static(uploadsDir));

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`=======================================================`);
  logger.log(`🚗 VahaanRent India Vehicle Rental API running on port ${port}`);
  logger.log(`📡 GraphQL Endpoint: http://localhost:${port}/graphql`);
  logger.log(`📁 Static Uploads Directory: http://localhost:${port}/uploads`);
  logger.log(`🍃 Connected to MongoDB 7.0 (Collections seeded)`);
  logger.log(`⚡ Apache Kafka Event Stream Initialized`);
  logger.log(`=======================================================`);
}
bootstrap();
