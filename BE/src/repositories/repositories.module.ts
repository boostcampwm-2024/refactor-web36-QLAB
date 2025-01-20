import { Module } from '@nestjs/common';
import { RedisModule } from 'src/config/redis/redis.module';
import { SessionRepository } from './session.repository';

@Module({
  imports: [RedisModule],
  providers: [SessionRepository],
  exports: [SessionRepository],
})
export class RepositoriesModule {}
