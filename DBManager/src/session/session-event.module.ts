import { Module } from '@nestjs/common';
import { RedisModule } from '../config/redis/redis.module';
import { UserDBModule } from '../user-db/user-db.module';
import { SessionEventHandler } from './session-event.handler';

@Module({
  imports: [RedisModule, UserDBModule],
  providers: [SessionEventHandler],
})
export class SessionEventModule {}
