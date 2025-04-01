import { Module } from '@nestjs/common';
import { RedisProviderModule } from 'src/config/redisProvider/redis-provider.module';
import { SessionManager } from './session-manager';
import { ReadyQueueManager } from './ready-queue.manager';
import { RateLimiterManager } from './rate-limiter.manager';

@Module({
  imports: [RedisProviderModule],
  providers: [ReadyQueueManager, SessionManager, RateLimiterManager],
  exports: [ReadyQueueManager, SessionManager, RateLimiterManager],
})
export class RedisModule {}
