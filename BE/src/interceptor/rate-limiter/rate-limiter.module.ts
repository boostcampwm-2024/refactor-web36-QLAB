import { Module } from '@nestjs/common';
import { RedisProviderModule } from 'src/config/redis-provider/redis-provider.module';
import { RateLimiterManager } from './rate-limiter.manager';
import { UserDBModule } from '../user-database/user-db.moudle';

@Module({
  imports: [RedisProviderModule, UserDBModule],
  providers: [RateLimiterManager],
  exports: [RateLimiterManager],
})
export class RateLimiterModule {}
