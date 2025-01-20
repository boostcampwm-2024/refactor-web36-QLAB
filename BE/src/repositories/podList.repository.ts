import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class PodListRepository {
  constructor(
    @Inject('POD_LIST_STORE_CONNECTION')
    private readonly sessionConnection: Redis,
  ) {}
  public async getConnectedPod(key: string): Promise<string> {
    return this.sessionConnection.hget(key, 'podIp');
  }
}
