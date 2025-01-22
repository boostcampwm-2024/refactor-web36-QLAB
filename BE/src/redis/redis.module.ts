import { Module } from '@nestjs/common';
import { RedisProviderModule } from 'src/config/redisProvider/redis-provider.module';
import { SessionRepository } from './session.repository';
import { ActiveUserRepository } from './active-user.repository';
import { PodListRepository } from './podList.repository';
import { ReadyQueueManager } from './ready-queue.manager';

@Module({
  imports: [RedisProviderModule],
  providers: [
    ReadyQueueManager,
    SessionRepository,
    ActiveUserRepository,
    PodListRepository,
  ],
  exports: [
    ReadyQueueManager,
    SessionRepository,
    ActiveUserRepository,
    PodListRepository,
  ],
})
export class RedisModule {}
