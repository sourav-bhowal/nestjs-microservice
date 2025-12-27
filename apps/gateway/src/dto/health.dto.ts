import { ClientProxy } from '@nestjs/microservices';

export type ServicePingDto = {
  serviceName: string;
  client: ClientProxy;
};
