import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RateLimiterManager {
  constructor(
    @Inject('RATE_LIMITER_CONNECTION')
    private readonly redis: Redis,
  ) {}
}
