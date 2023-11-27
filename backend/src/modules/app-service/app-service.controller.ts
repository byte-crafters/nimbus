import { Controller, Get, VERSION_NEUTRAL, Version } from '@nestjs/common';
import { Public } from '@modules/auth/auth.decorator';

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
