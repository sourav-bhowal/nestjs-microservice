import { Injectable } from '@nestjs/common';
import { HealthCheckResponse } from './dto/health.dto';

@Injectable()
export class GatewayService {
  checkHealth(): HealthCheckResponse {
    return {
      status: 'ok',
      timestamp: new Date().toLocaleDateString(),
      uptime: process.uptime(),
      service: 'Gateway Service',
    };
  }
}
