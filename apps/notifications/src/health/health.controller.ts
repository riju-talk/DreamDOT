import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'OK',
      service: 'notifications',
      timestamp: new Date().toISOString(),
    };
  }
}
