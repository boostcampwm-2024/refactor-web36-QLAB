import { Injectable } from "@nestjs/common";
import { RedisService } from "src/config/redis/redis.service";

@Injectable()
export class LoadBalancer {
  constructor(private readonly redisService: RedisService) {}
  async allocate(sessionId: string) {
    const allPods = await this.redisService.keysPod()

    let minActiveUser = Infinity;
    let selectedPod = '';

    for (const podName of allPods) {
      const activeUser = Number(await this.redisService.hgetPod(podName, 'activeUser'));
      if (activeUser < minActiveUser) {
        minActiveUser = activeUser;
        selectedPod = podName;
      }
    }
    const selectedPodIp = await this.redisService.hgetPod(selectedPod, 'podIp');

    await this.redisService.hsetSession(sessionId, 'pod', selectedPod);
    await this.redisService.hsetSession(sessionId, 'podIp', selectedPodIp);
  }
}
