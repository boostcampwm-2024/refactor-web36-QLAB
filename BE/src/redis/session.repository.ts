import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class SessionRepository {
  private readonly SESSION_TTL = 60 * 30;

  constructor(
    @Inject('SESSION_STORE_CONNECTION')
    private readonly redisConnection: Redis,
  ) {}

  async getSession(key: string) {
    if (!key) {
      return null;
    }
    return this.redisConnection.hgetall(key);
  }

  public async existSession(key: string) {
    return this.redisConnection.exists(key);
  }

  public async setNewSession(key: string) {
    const session = await this.existSession(key);
    if (!session) {
      await this.redisConnection.hset(key, 'rowCount', 0);
    }
    await this.redisConnection.expire(key, this.SESSION_TTL);
  }

  public async deleteSession(key: string) {
    await this.redisConnection.del(key);
  }

  public async getRowCount(key: string) {
    return this.redisConnection.hget(key, 'rowCount');
  }

  public async setRowCount(key: string, rowCount: number) {
    await this.redisConnection.hset(key, 'rowCount', rowCount);
  }

  public async setSessionTTL(key: string) {
    this.redisConnection.expire(key, this.SESSION_TTL);
  }

  public async newSessionPublish(key: string) {
    return this.redisConnection.publish('newSession', key);
  }

  public async getConnectedPod(key: string): Promise<string> {
    return this.redisConnection.hget(key, 'podIp');
  }
}
