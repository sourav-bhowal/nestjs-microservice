import { Controller, Get } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import type { HealthCheckResponse } from './dto/health.dto';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get('health')
  checkHealth(): HealthCheckResponse {
    return this.gatewayService.checkHealth();
  }
}
