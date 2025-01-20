import { Module } from '@nestjs/common';
import { RedisModule } from 'src/config/redis/redis.module';
import { SessionRepository } from './session.repository';
import { ActiveUserRepository } from './activeUser.repository';
import { PodListRepository } from './podList.repository';

@Module({
  imports: [RedisModule],
  providers: [SessionRepository, ActiveUserRepository, PodListRepository],
  exports: [SessionRepository, ActiveUserRepository, PodListRepository],
})
export class RepositoriesModule {}
