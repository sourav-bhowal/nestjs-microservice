import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  ping() {
    return {
      status: 'ok',
      timestamp: new Date().toLocaleDateString(),
      service: 'search ping',
    };
  }
}
