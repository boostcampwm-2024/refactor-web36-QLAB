import { Module } from '@nestjs/common';
import { RedisModule } from 'src/config/redis/redis.module';
import { SessionRepository } from './session.repository';
import { ActiveUserRepository } from './activeUser.repository';

@Module({
  imports: [RedisModule],
  providers: [SessionRepository, ActiveUserRepository],
  exports: [SessionRepository, ActiveUserRepository],
})
export class RepositoriesModule {}
