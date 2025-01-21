import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class SessionRepository {
  private readonly SESSION_TTL = 60 * 30;

  constructor(
    @Inject('SESSION_STORE_CONNECTION')
    private readonly sessionConnection: Redis,
  ) {}

  async getSession(key: string) {
    if (!key) {
      return null;
    }
    return this.sessionConnection.hgetall(key);
  }

  public async existSession(key: string) {
    return this.sessionConnection.exists(key);
  }

  public async setNewSession(key: string) {
    const session = await this.existSession(key);
    if (!session) {
      await this.sessionConnection.hset(key, 'rowCount', 0);
    }
    await this.sessionConnection.expire(key, this.SESSION_TTL);
  }

  public async deleteSession(key: string) {
    await this.sessionConnection.del(key);
  }

  public async getRowCount(key: string) {
    return this.sessionConnection.hget(key, 'rowCount');
  }

  public async setRowCount(key: string, rowCount: number) {
    await this.sessionConnection.hset(key, 'rowCount', rowCount);
  }

  public async setSessionTTL(key: string) {
    this.sessionConnection.expire(key, this.SESSION_TTL);
  }

  public async newSessionPublish(key: string) {
    return this.sessionConnection.publish('newSession', key);
  }
}
