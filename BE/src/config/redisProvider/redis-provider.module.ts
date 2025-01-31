import { Module } from '@nestjs/common';
import { RedisProviders } from './redis.providers';

@Module({
  providers: [...RedisProviders],
  exports: [...RedisProviders],
})
export class RedisProviderModule {}
