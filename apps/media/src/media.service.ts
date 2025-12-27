import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaService {
  ping() {
    return {
      status: 'ok',
      timestamp: new Date().toLocaleDateString(),
      service: 'media ping',
    };
  }
}
