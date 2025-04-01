import { Module } from '@nestjs/common';
import { RedisProviderModule } from 'src/config/redisProvider/redis-provider.module';
import { ReadyQueueManager } from './ready-queue.manager';
import { RateLimiterManager } from './rate-limiter.manager';

@Module({
  imports: [RedisProviderModule],
  providers: [ReadyQueueManager, RateLimiterManager],
  exports: [ReadyQueueManager, RateLimiterManager],
})
export class RedisModule {}
