import { ClientProxy } from '@nestjs/microservices';

export type ServicePingType = {
  serviceName: string;
  client: ClientProxy;
};
