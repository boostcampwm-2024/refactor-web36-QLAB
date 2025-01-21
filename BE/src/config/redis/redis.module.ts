import { Module } from '@nestjs/common';
import { UserDBModule } from '../query-database/user-db.moudle';
import { RedisProviders } from './redis.providers';

@Module({
  imports: [UserDBModule],
  providers: [...RedisProviders],
  exports: [...RedisProviders],
})
export class RedisModule {}
