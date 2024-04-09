import { Module } from '@nestjs/common';
import { userServiceDefaultProvider } from '@src/dependencies/providers';
import { DevConfigService } from './dev.config.service';
import { TestConfigService } from './test.config.service';

@Module({
    providers: [
        {
            provide: Symbol.for('IConfigService'),
            useClass: DevConfigService,
        },
        TestConfigService,
    ],
    exports: [
        {
            provide: Symbol.for('IConfigService'),
            useClass: DevConfigService,
        },
        TestConfigService,
    ],
})
export class ConfigModule {}
