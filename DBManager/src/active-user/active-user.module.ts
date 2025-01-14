import { Module } from '@nestjs/common';
import { ActiveUserService } from './active-user.service';
import { RedisModule } from '../config/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [ActiveUserService],
})
export class ActiveUserModule {}
