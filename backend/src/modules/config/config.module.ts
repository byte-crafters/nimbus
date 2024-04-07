import { Module } from '@nestjs/common';
import { userServiceDefaultProvider } from '@src/dependencies/providers';
import { DevConfigService } from './dev.config.service';
import { TestConfigService } from './test.config.service';

@Module({
    providers: [DevConfigService, TestConfigService],
    exports: [DevConfigService, TestConfigService],
})
export class ConfigModule { }
