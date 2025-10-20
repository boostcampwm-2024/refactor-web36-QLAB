import { Module } from '@nestjs/common';
import { RedisProviderModule } from 'src/config/redis-provider/redis-provider.module';
import { RateLimiterManager } from './rate-limiter.manager';
import { UserDBModule } from '../user-database/user-db.moudle';
import { QueryLockManager } from '../../config/redis-provider/query-lock.manager';

@Module({
  imports: [RedisProviderModule, UserDBModule],
  providers: [RateLimiterManager, QueryLockManager],
  exports: [RateLimiterManager, QueryLockManager],
})
export class RateLimiterModule {}
