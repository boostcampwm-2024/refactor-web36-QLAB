import { Module } from '@nestjs/common';
import { LoadBalancer } from './load-balancer';
import { RedisModule } from 'src/config/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [LoadBalancer],
  exports: [LoadBalancer],
})
export class LoadBalancerModule {}
