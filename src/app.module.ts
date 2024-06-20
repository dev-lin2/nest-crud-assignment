import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { LocationModule } from './location/location.module';

@Module({
  imports: [DatabaseModule, LocationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
