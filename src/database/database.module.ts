import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global() // We would like database service to be global, so it won't need to re-import everytime
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
