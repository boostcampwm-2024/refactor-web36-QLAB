import {Inject, Injectable} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class SessionRepository {
  private readonly SESSION_TTL = 60 * 30;

  constructor(@Inject('REDIS_PROVIDER') private readonly redis: Redis) {}

  async getSession(sessionId: string) {
    if (!sessionId) {
      return null;
    }
    return this.redis.hgetall('session:' + sessionId);
  }

  public async setSession(sessionId: string) {
    const session = await this.redis.exists('session:' + sessionId);
    if (!session) {
      await this.redis.set('session:expiring:' + sessionId, '');
      await this.redis.hset(sessionId, 'rowCount', 0);
    }
    await this.redis.expire('session:expiring:' + sessionId, this.SESSION_TTL);
  }

  public async getRowCount(sessionId: string) {
    return this.redis.hget('session:' + sessionId, 'rowCount');
  }

  public async setRowCount(sessionId: string, rowCount: number) {
    await this.redis.hset('session:' + sessionId, 'rowCount', rowCount);
  }

  public async getConnectedPod(sessionId: string): Promise<string> {
    return this.redis.hget('session:' + sessionId, 'podIp');
  }
}
