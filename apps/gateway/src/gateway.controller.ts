import { Controller, Get, Inject } from '@nestjs/common';
import { ServicePingType } from './types/health.type';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { PingResponseType } from './types/ping.type';

@Controller()
export class GatewayController {
  constructor(
    @Inject('CATALOG_CLIENT') private readonly catalogClient: ClientProxy,
    @Inject('MEDIA_CLIENT') private readonly mediaClient: ClientProxy,
    @Inject('SEARCH_CLIENT') private readonly searchClient: ClientProxy,
  ) {}

  @Get('health')
  async checkHealth() {
    const ping = async ({ serviceName, client }: ServicePingType) => {
      try {
        // Send ping message to the service
        const result: PingResponseType = await firstValueFrom(
          client.send<PingResponseType>('service.ping', { from: 'gateway' }),
        );

        return {
          ok: true,
          service: serviceName,
          result,
        };
      } catch (error) {
        return {
          ok: false,
          service: serviceName,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    };

    // Ping all services concurrently
    const [catalog, media, search] = await Promise.all([
      ping({
        serviceName: 'catalog',
        client: this.catalogClient,
      }),
      ping({
        serviceName: 'media',
        client: this.mediaClient,
      }),
      ping({
        serviceName: 'search',
        client: this.searchClient,
      }),
    ]);

    // Determine overall health status
    const allOk = [catalog, media, search].every((res) => res.ok);

    // Return health status
    return {
      status: allOk ? 'ok' : 'degraded',
      services: {
        catalog,
        media,
        search,
      },
    };
  }
}
