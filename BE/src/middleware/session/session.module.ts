import { forwardRef, Module } from '@nestjs/common';
import { RedisProviderModule } from '../../config/redisProvider/redis-provider.module';
import { SessionRepository } from './session.manager';
import { UserDBModule } from '../../interceptor/user-database/user-db.moudle';
import { SessionExpiredListener } from './session-expired.listener';

@Module({
  imports: [RedisProviderModule, forwardRef(() => UserDBModule)],
  providers: [SessionRepository, SessionExpiredListener],
  exports: [SessionRepository],
})
export class SessionModule {}
