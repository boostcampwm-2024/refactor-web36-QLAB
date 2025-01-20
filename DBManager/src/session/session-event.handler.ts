import { RedisService } from '../config/redis/redis.service';
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
    this.redisService.subscribeSession(channel);
    this.redisService.eventHandlerSession(channel, async (sessionId) => {
      await this.loadBalancer.allocate(sessionId);
      const podIp = await this.redisService.hgetSession(sessionId, 'podIp');
      this.userDBService.initUserDatabase(podIp, sessionId);
    });
  }

  private expiredEventHandler() {
    const channel = '__keyevent@0__:expired';
     this.redisService.subscribeSession(channel);
     this.redisService.eventHandlerSession(channel, async (sessionId) => {
      const pod = await this.redisService.hgetSession(sessionId, 'pod');
      this.userDBService.removeDatabase(pod, sessionId);
    });
  }
}
