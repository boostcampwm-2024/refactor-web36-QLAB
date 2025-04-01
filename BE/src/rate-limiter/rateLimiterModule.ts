import { Module } from '@nestjs/common';
import { RedisProviderModule } from 'src/config/redisProvider/redis-provider.module';
import { RateLimiterManager } from './rate-limiter.manager';

@Module({
  imports: [RedisProviderModule],
  providers: [RateLimiterManager],
  exports: [RateLimiterManager],
})
export class RateLimiterModule {}
