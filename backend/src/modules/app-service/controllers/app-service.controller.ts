import { Public } from '@modules/auth/services/auth.decorator';
import { Controller, Get, VERSION_NEUTRAL, Version } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller({
    version: VERSION_NEUTRAL,
})
export class AppServiceController {
    @ApiTags('help')
    @Public()
    @Get('health')
    @Version(VERSION_NEUTRAL)
    healthCheck() {
        return 'alive';
    }
}
