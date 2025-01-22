import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class ReadyQueueManager {
  private readonly INTERVAL = 300;

  constructor(
    @Inject('READY_QUEUE_CONNECTION')
    private readonly redis: Redis,
  ) {}

  public async enqueue(requestId: string, sessionId: string): Promise<void> {
    const timeStamp = new Date().getTime();
    this.redis.zadd(sessionId, timeStamp, requestId);
  }

  public async waitForPriority(
    requestId: string,
    sessionId: string,
  ): Promise<boolean> {
    while (true) {
      const rank = await this.redis.zrank(sessionId, requestId);

      if (rank === 0) {
        return true;
      }

      await this.sleep(this.INTERVAL);
    }
  }

  public async dequeue(requestId: string, sessionId: string): Promise<void> {
    await this.redis.zrem(sessionId, requestId);
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
