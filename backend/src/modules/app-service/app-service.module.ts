import { Module } from '@nestjs/common';
import { AppServiceController } from './controllers/app-service.controller';

@Module({
    controllers: [AppServiceController],
})
export class AppServiceModule {}
