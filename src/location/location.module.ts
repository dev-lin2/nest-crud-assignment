import { Logger, Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';

@Module({
  controllers: [LocationController],
  providers: [LocationService, Logger],
})
export class LocationModule {}
