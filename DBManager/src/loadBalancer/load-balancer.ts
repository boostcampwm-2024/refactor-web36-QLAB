import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class LoadBalancer {
  constructor(private readonly redisService: RedisService) {}
  async allocate(sessionId: string) {
    const selectedPodIp = await this.redisService.getMinActivUserPod();
    await this.redisService.setPodIp(sessionId, selectedPodIp);
  }
}
