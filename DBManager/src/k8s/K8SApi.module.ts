import { Module } from '@nestjs/common';
import { K8SApiService } from './K8SApi.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  exports: [K8SApiService],
  providers: [K8SApiService],
})
export class K8SApiModule {}
