import { Module } from '@nestjs/common';
import { RedisProviderModule } from 'src/config/redis-provider/redis-provider.module';
import { RateLimiterManager } from './rate-limiter.manager';
import { QueryLockManager } from '../../config/redis-provider/query-lock.manager';

@Module({
  imports: [RedisProviderModule],
  providers: [RateLimiterManager, QueryLockManager],
  exports: [RateLimiterManager, QueryLockManager],
})
export class RateLimiterModule {}
