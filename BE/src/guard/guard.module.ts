import { Module } from '@nestjs/common';
import { ShellGuard } from './shell.guard';
import { ShellModule } from '../shell/shell.module';
import { RateLimiterGuard } from './rate-limiter.guard';
import { RateLimiterModule } from '../interceptor/rate-limiter/rate-limiter.module';

@Module({
  imports: [ShellModule, RateLimiterModule],
  providers: [ShellGuard, RateLimiterGuard],
})
export class GuardModule {}
