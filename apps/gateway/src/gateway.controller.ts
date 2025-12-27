import { Controller, Get, Inject } from '@nestjs/common';
import { ServicePingDto } from './dto/health.dto';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class GatewayController {
  constructor(
    @Inject('CATALOG_CLIENT') private readonly catalogClient: ClientProxy,
    @Inject('MEDIA_CLIENT') private readonly mediaClient: ClientProxy,
    @Inject('SEARCH_CLIENT') private readonly searchClient: ClientProxy,
  ) {}

  @Get('health')
  async checkHealth() {
    const ping = async ({ serviceName, client }: ServicePingDto) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result = await firstValueFrom(
          client.send('service.ping', { from: 'gateway' }),
        );

        return {
          ok: true,
          service: serviceName,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          result,
        };
      } catch (error) {
        return {
          ok: false,
          service: serviceName,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          error: error.message ?? 'unknown error',
        };
      }
    };

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

    const allOk = [catalog, media, search].every((res) => res.ok);

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
