import { RedisService } from '../redis/redis.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserDBService } from '../user-db/user-db.service';
import { LoadBalancer } from 'src/loadBalancer/load-balancer';

@Injectable()
export class SessionEventHandler implements OnModuleInit {
  constructor(
    private readonly redisService: RedisService,
    private readonly userDBService: UserDBService,
    private readonly loadBalancer: LoadBalancer,
  ) {}

  onModuleInit() {
    this.appendEventHandler();
    this.expiredEventHandler();
  }

  private appendEventHandler() {
    const channel = 'newSession';
    this.redisService.subscribeSession(channel, async (sessionId) => {
      await this.loadBalancer.allocate(sessionId);
      const podIp = await this.redisService.getPodIpBySessionId(sessionId);
      await this.userDBService.initUserDatabase(podIp, sessionId);
      await this.redisService.incrActiveUser(podIp);
    });
  }

  private expiredEventHandler() {
    const channel = '__keyevent@0__:expired';
    this.redisService.subscribeSession(channel, async (key) => {
      if (key.startsWith('session:expiring:')) {
        const sessionId = key.split(':')[2];
        const podIp = await this.redisService.getPodIpBySessionId(sessionId);

        await this.userDBService.removeDatabase(podIp, key);
        await this.redisService.decrActiveUser(podIp);
        await this.redisService.removeSession(podIp);
      }
    });
  }
}
