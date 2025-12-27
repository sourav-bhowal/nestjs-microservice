import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { CatalogModule } from './catalog.module';

// Create a logger instance
const logger = new Logger('CatalogBootstrap');

async function bootstrap() {
  process.title = 'Catalog Service';

  // Read RabbitMQ configuration from environment variables
  const RABBITMQ_URL = process.env.RABBITMQ_URL;
  const CATALOG_QUEUE = process.env.CATALOG_QUEUE;

  // Validate environment variables
  if (!RABBITMQ_URL || !CATALOG_QUEUE) {
    logger.error(
      'RABBITMQ_URL or CATALOG_QUEUE is not defined in environment variables',
    );
    process.exit(1);
  }

  // Create the NestJS microservice instance
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CatalogModule,
    {
      transport: Transport.RMQ, // Using RabbitMQ transport for microservice communication
      options: {
        urls: [RABBITMQ_URL],
        queue: CATALOG_QUEUE,
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  // Enable shutdown hooks for graceful shutdown
  app.enableShutdownHooks();

  // Start the microservice
  await app.listen();
}

// Call the bootstrap function and handle success/error logging
bootstrap()
  .then(() => {
    logger.log('Catalog (RMQ) service started successfully');
  })
  .catch((err) => {
    logger.error('Error starting Catalog (RMQ) service', err);
    process.exit(1);
  });
