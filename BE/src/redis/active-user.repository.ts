import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class ActiveUserRepository {
  private readonly ACTIVE_USER_TTL = 60 * 5;

  constructor(
    @Inject('ACTIVE_USER_STORE_CONNECTION')
    private readonly redisConnection: Redis,
  ) {}

  public async existActiveUser(key: string): Promise<boolean> {
    const existNum = await this.redisConnection.exists(key);
    if (existNum === 0) return false;
    return true;
  }

  public async setActiveUser(key: string) {
    await this.redisConnection.set(key, '');
  }

  public async setTTLActiveUser(key: string) {
    await this.redisConnection.expire(key, this.ACTIVE_USER_TTL);
  }

  public async newActiveUserPublish(key: string) {
    return this.redisConnection.publish('newActiveUser', key);
  }

  public async updateActiveUser(key: string) {
    const isActive = await this.existActiveUser(key);
    if (!isActive) {
      await this.setActiveUser(key);
      await this.newActiveUserPublish(key);
    }
    this.setTTLActiveUser(key);
  }
}
