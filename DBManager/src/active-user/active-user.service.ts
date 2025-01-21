import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from '../config/redis/redis.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ActiveUserService implements OnModuleInit {
  private activeUserVariation = new Map<string, number>();
  constructor(private readonly redisService: RedisService) {}

  onModuleInit() {
    this.countUp();
    this.countDown();
  }

  private countUp() {
    const channel = '__keyspace@1__:set';
    this.redisService.subscribeActiveUser(channel, async (sessionId) => {
      const pod = await this.redisService.hgetSession(sessionId, 'pod');

      const currentCount = this.activeUserVariation.get(pod) ?? 0;
      this.activeUserVariation.set(pod, currentCount + 1);
    });
  }

  private countDown() {
    const channel = '__keyevent@1__:expired';
    this.redisService.subscribeActiveUser(channel, async (sessionId) => {
      const pod = await this.redisService.hgetSession(sessionId, 'pod');

      const currentCount = this.activeUserVariation.get(pod) ?? 0;
      this.activeUserVariation.set(pod, currentCount - 1);
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async applyToRedis() {
    for (const [pod, variation] of this.activeUserVariation.entries()) {
      const count = await this.redisService.hgetPod(pod, 'activeUser');
      const newCount = (count ? parseInt(count, 10) : 0) + variation;

      await this.redisService.hsetPod(pod, 'activeUser', newCount);
    }
    this.activeUserVariation.clear();
  }
}
