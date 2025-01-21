import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class ActiveUserRepository {
  private readonly ACTIVE_USER_TTL = 60 * 5;

  constructor(
    @Inject('ACTIVE_USER_STORE_CONNECTION')
    private readonly sessionConnection: Redis,
  ) {}

  public async existActiveUser(key: string): Promise<boolean> {
    const existNum = await this.sessionConnection.exists(key);
    if (existNum === 0) return false;
    return true;
  }

  public async setActiveUser(key: string) {
    await this.sessionConnection.set(key, '');
  }

  public async setTTLActiveUser(key: string) {
    await this.sessionConnection.expire(key, this.ACTIVE_USER_TTL);
  }
}
