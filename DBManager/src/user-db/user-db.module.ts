import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { UserDBService } from './user-db.service';
import { UserDBConnector } from './user-db.connector';

@Module({
  imports: [RedisModule],
  providers: [UserDBService, UserDBConnector],
  exports: [UserDBService],
})
export class UserDBModule {}
