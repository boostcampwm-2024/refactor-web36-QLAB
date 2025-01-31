import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class ActiveUserManager {
  private readonly ACTIVE_USER_TTL = 60 * 5;

  constructor(
    @Inject('ACTIVE_USER_STORE_CONNECTION')
    private readonly redis: Redis,
  ) {}

  public async existActiveUser(key: string): Promise<boolean> {
    const existNum = await this.redis.exists(key);
    if (existNum === 0) return false;
    return true;
  }

  public async setActiveUser(key: string) {
    await this.redis.set(key, '');
  }

  public async setTTLActiveUser(key: string) {
    await this.redis.expire(key, this.ACTIVE_USER_TTL);
  }

  public async newActiveUserPublish(key: string) {
    console.log('newActiveUser Event publish');
    return this.redis.publish('newActiveUser', key);
  }

  public async updateActiveUser(key: string) {
    const isActive = await this.existActiveUser(key);
    console.log('updateActive User, isActive: ', isActive);
    if (!isActive) {
      await this.setActiveUser(key);
      await this.newActiveUserPublish(key);
    }
    this.setTTLActiveUser(key);
  }
}
