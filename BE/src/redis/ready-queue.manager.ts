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
    await this.redis.rpush(sessionId, requestId);
  }

  public async waitForPriority(
    requestId: string,
    sessionId: string,
  ): Promise<boolean> {
    while (true) {
      const firstRequest = await this.redis.lindex(sessionId, 0);
      if (firstRequest === requestId) return;
      await this.sleep(this.INTERVAL);
    }
  }

  public async dequeue(sessionId: string): Promise<void> {
    await this.redis.lpop(sessionId);
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
