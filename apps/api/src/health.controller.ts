import { Controller, Get } from '@nestjs/common';

/** Minimal liveness endpoint used by the Story 1.1 smoke check. */
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'api' };
  }
}
