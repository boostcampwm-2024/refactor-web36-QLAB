import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from '../config/redis/redis.service';

@Injectable()
export class ActiveUserService implements OnModuleInit {
  constructor(private readonly redisService: RedisService) {}

  onModuleInit() {
    this.countUp();
    this.countDown();
  }

  private countUp() {
    const channel = 'newActiveUser';
    this.redisService.subscribeActiveUser(channel, async (sessionId) => {
      const pod = await this.redisService.hgetSession(sessionId, 'pod');
      await this.redisService.hIncrPod(pod, 'activeUser', 1);
    });
  }

  private countDown() {
    const channel = '__keyevent@1__:expired';
    this.redisService.subscribeActiveUser(channel, async (sessionId) => {
      const pod = await this.redisService.hgetSession(sessionId, 'pod');
      await this.redisService.hIncrPod(pod, 'activeUser', -1);
    });
  }
}
