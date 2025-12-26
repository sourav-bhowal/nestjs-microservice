import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { SearchModule } from './search.module';
const logger = new Logger('SearchBootstrap');

async function bootstrap() {
  process.title = 'Search Service';

  // Read RabbitMQ configuration from environment variables
  const RABBITMQ_URL = process.env.RABBITMQ_URL;
  const SEARCH_QUEUE = process.env.SEARCH_QUEUE;

  if (!RABBITMQ_URL || !SEARCH_QUEUE) {
    logger.error(
      'RABBITMQ_URL or SEARCH_QUEUE is not defined in environment variables',
    );
    process.exit(1);
  }

  // Create the NestJS microservice instance
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SearchModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [RABBITMQ_URL],
        queue: SEARCH_QUEUE,
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
    logger.log('Search (TCP) service started successfully');
  })
  .catch((err) => {
    logger.error('Error starting Search (TCP) service', err);
    process.exit(1);
  });
