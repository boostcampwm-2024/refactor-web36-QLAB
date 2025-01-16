import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { UserDBModule } from '../query-database/user-db.moudle';

@Module({
  imports: [UserDBModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
