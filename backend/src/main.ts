import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`=======================================================`);
  logger.log(`🚗 VahaanRent India Vehicle Rental API running on port ${port}`);
  logger.log(`📡 GraphQL Endpoint: http://localhost:${port}/graphql`);
  logger.log(`🍃 Connected to MongoDB 7.0 (Collections seeded)`);
  logger.log(`⚡ Apache Kafka Event Stream Initialized`);
  logger.log(`=======================================================`);
}
bootstrap();
