import { Module } from '@nestjs/common';
import { ShellGuard } from './shell.guard';
import { ShellModule } from '../shell/shell.module';
import { RateLimiterGuard } from './rate-limiter.guard';
import { RedisModule } from '../rate-limiter/redis.module';

@Module({
  imports: [ShellModule, RedisModule],
  providers: [ShellGuard, RateLimiterGuard],
})
export class GuardModule {}
