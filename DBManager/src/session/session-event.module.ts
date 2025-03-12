import { Module } from '@nestjs/common';
import { RedisModule } from '../config/redis/redis.module';
import { UserDBModule } from '../user-db/user-db.module';
import { SessionEventHandler } from './session-event.handler';
import { LoadBalancerModule } from 'src/loadBalancer/load-balancer.module';

@Module({
  imports: [RedisModule, UserDBModule, LoadBalancerModule],
  providers: [SessionEventHandler],
})
export class SessionEventModule {}
