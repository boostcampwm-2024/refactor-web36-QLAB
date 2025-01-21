import { Module } from '@nestjs/common';
import { RedisProviderModule } from 'src/config/redisProvider/redis-provider.module';
import { SessionRepository } from './session.repository';
import { ActiveUserRepository } from './activeUser.repository';
import { PodListRepository } from './podList.repository';

@Module({
  imports: [RedisProviderModule],
  providers: [SessionRepository, ActiveUserRepository, PodListRepository],
  exports: [SessionRepository, ActiveUserRepository, PodListRepository],
})
export class RedisModule {}
