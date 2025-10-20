import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { QueryLockedException } from '../../common/exception/custom-exception';

@Injectable()
export class QueryLockManager {
  constructor(@Inject('REDIS_PROVIDER') private readonly redis: Redis) {}

  private getLockKey(sessionId: string): string {
    return `query:lock:${sessionId}`;
  }

  async acquireLock(sessionId: string, ttl: number = 20000): Promise<void> {
    const lockKey = this.getLockKey(sessionId);
    const result = await this.redis.set(lockKey, '1', 'PX', ttl, 'NX');

    if (!result) {
      throw new QueryLockedException();
    }
  }

  async releaseLock(sessionId: string): Promise<void> {
    const lockKey = this.getLockKey(sessionId);
    await this.redis.del(lockKey);
  }
}
