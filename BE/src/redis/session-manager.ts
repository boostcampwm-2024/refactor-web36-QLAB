import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class SessionManager {
  private readonly SESSION_TTL = 60 * 30;

  constructor(
    @Inject('SESSION_STORE_CONNECTION')
    private readonly redis: Redis,
  ) {}

  async getSession(key: string) {
    if (!key) {
      return null;
    }
    return this.redis.hgetall(key);
  }

  public async existSession(key: string) {
    return this.redis.exists(key);
  }

  public async setNewSession(key: string) {
    const session = await this.existSession(key);
    if (!session) {
      await this.redis.hset(key, 'rowCount', 0);
    }
    await this.redis.expire(key, this.SESSION_TTL);
  }

  public async deleteSession(key: string) {
    await this.redis.del(key);
  }

  public async getRowCount(key: string) {
    return this.redis.hget(key, 'rowCount');
  }

  public async setRowCount(key: string, rowCount: number) {
    await this.redis.hset(key, 'rowCount', rowCount);
  }

  public async setSessionTTL(key: string) {
    this.redis.expire(key, this.SESSION_TTL);
  }

  public async newSessionPublish(key: string) {
    return this.redis.publish('newSession', key);
  }

  public async getConnectedPod(key: string): Promise<string> {
    return this.redis.hget(key, 'podIp');
  }
}
