import { Public } from '@modules/auth/services/auth.decorator';
import { Controller, Get, VERSION_NEUTRAL, Version } from '@nestjs/common';

@Controller({
    version: VERSION_NEUTRAL,
})
export class AppServiceController {
    @Public()
    @Get('health')
    @Version(VERSION_NEUTRAL)
    healthCheck() {
        return 'alive';
    }
}
