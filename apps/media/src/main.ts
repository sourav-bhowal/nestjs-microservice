import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { MediaModule } from './media.module';

const logger = new Logger('MediaBootstrap');

async function bootstrap() {
  process.title = 'Media Service';

  // Read RabbitMQ configuration from environment variables
  const RABBITMQ_URL = process.env.RABBITMQ_URL;
  const MEDIA_QUEUE = process.env.MEDIA_QUEUE;

  // Validate environment variables
  if (!RABBITMQ_URL || !MEDIA_QUEUE) {
    logger.error(
      'RABBITMQ_URL or MEDIA_QUEUE is not defined in environment variables',
    );
    process.exit(1);
  }

  // Create the NestJS microservice instance
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MediaModule,
    {
      transport: Transport.RMQ, // Using RabbitMQ transport for microservice communication
      options: {
        urls: [RABBITMQ_URL],
        queue: MEDIA_QUEUE,
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
    logger.log('Media (RMQ) service started successfully');
  })
  .catch((err) => {
    logger.error('Error starting Media (RMQ) service', err);
    process.exit(1);
  });
