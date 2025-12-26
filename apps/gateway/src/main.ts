import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  process.title = 'Gateway Service';

  // Create the NestJS application instance
  const app = await NestFactory.create(GatewayModule);

  // Enable shutdown hooks this is important for microservices as it allows graceful shutdown
  app.enableShutdownHooks();

  // Read port from environment variable or use default
  const port = Number(process.env.GATEWAY_PORT) || 8000;

  // Listen on the specified port
  await app.listen(port);
}

// Call the bootstrap function and handle success/error logging
bootstrap()
  .then(() => {
    const logger = new Logger('GatewayBootstrap');
    logger.log('Gateway service started successfully');
  })
  .catch((err) => {
    const logger = new Logger('GatewayBootstrap');
    logger.error('Error starting Gateway service', err);
    process.exit(1);
  });
