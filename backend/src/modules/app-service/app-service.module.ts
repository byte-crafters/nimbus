import { Module } from '@nestjs/common';
import { AppServiceController } from '@modules/app-service/app-service.controller';

@Module({
  controllers: [AppServiceController],
})
export class AppServiceModule {}
