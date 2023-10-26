import { Controller, Get, VERSION_NEUTRAL, Version } from '@nestjs/common';

@Controller({
  version: VERSION_NEUTRAL,
})
export class AppServiceController {
  @Get('health')
  @Version(VERSION_NEUTRAL)
  healthCheck() {
    return 'alive';
  }
}
