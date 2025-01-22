import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class PodListRepository {
  constructor(
    @Inject('POD_LIST_STORE_CONNECTION')
    private readonly sessionConnection: Redis,
  ) {}
}
