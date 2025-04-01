import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RateLimiterManager {
  private readonly TIME_WINDOW_MS = 60 * 1000;
  private readonly MAX_ALLOWED_DURATION_SEC = 20;

  constructor(@Inject('REDIS_PROVIDER') private readonly redis: Redis) {}

  public async getRemainTime(sessionId: string): Promise<number> {
    const currentTime = Date.now();
    const minTime = currentTime - this.TIME_WINDOW_MS;

    await this.redis.zremrangebyscore(sessionId, '-inf', minTime);

    const responseTimeList = await this.redis.zrange(sessionId, 0, -1);

    return (
      this.MAX_ALLOWED_DURATION_SEC -
      responseTimeList
        .map((value) => parseFloat(value))
        .reduce((acc, curr) => acc + curr, 0)
    );
  }

  public async addResponseTime(
    requestTime: number,
    sessionId: string,
    responseTime: number,
  ): Promise<void> {
    this.redis.zadd(sessionId, requestTime, responseTime);
  }
}
