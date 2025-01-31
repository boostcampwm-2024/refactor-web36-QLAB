import { Module } from '@nestjs/common';
import { RedisProviderModule } from 'src/config/redisProvider/redis-provider.module';
import { SessionManager } from './session-manager';
import { ActiveUserManager } from './active-user-manager';
import { ReadyQueueManager } from './ready-queue.manager';
import { RateLimiterManager } from './rate-limiter.manager';

@Module({
  imports: [RedisProviderModule],
  providers: [
    ReadyQueueManager,
    SessionManager,
    ActiveUserManager,
    RateLimiterManager,
  ],
  exports: [
    ReadyQueueManager,
    SessionManager,
    ActiveUserManager,
    RateLimiterManager,
  ],
})
export class RedisModule {}
