import { Module } from '@nestjs/common';
import { LoadBalancer } from './load-balancer';
import { RedisModule } from 'src/config/redis/redis.module';

@Module({
  providers: [LoadBalancer],
  exports: [LoadBalancer],
  imports: [RedisModule]
})
export class LoadBalancerModule {}
