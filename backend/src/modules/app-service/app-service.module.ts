import { Module } from '@nestjs/common';
import { AppServiceController } from './app-service.controller';

@Module({
  controllers: [AppServiceController],
})
export class AppServiceModule {}
