import { Injectable } from "@nestjs/common";
import { RedisService } from "src/config/redis/redis.service";

@Injectable()
export class LoadBalancer {
  constructor(private readonly redisService: RedisService) {}
  async allocate(sessionId: string) {
    const allPods = await this.redisService.keysPod();
    const podList = [];

    for (const podName of allPods) {
      const activeUser = await this.redisService.hgetPod(podName, 'activeUser');
      podList.push({ podName, activeUser });
    }
    podList.sort((a, b) => a.activeUser - b.activeUser);

    const selectedPod = podList[0].podName;
    const selectedPodIp = await this.redisService.hgetPod(selectedPod, 'podIp');

    console.log(selectedPod, selectedPod);
    await this.redisService.hsetSession(sessionId, 'pod', selectedPod);
    await this.redisService.hsetSession(sessionId, 'podIp', selectedPodIp);
  }
}
