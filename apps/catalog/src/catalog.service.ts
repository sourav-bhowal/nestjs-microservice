import { Injectable } from '@nestjs/common';

@Injectable()
export class CatalogService {
  ping() {
    return {
      status: 'ok',
      timestamp: new Date().toLocaleDateString(),
      service: 'catalog ping',
    };
  }
}
