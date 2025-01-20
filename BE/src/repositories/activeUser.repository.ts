import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class ActiveUserRepository {
  private readonly ACTIVE_USER_TTL = 60 * 30;

  constructor(
    @Inject('ACTIVE_USER_STORE_CONNECTION')
    private readonly sessionConnection: Redis,
  ) {}
  public async setActiveUser(key: string) {
    this.sessionConnection.expire(key, this.ACTIVE_USER_TTL);
  }
}
