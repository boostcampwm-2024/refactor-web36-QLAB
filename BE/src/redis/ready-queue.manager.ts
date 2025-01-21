import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReadyQueueManager {
  private readonly INTERVAL = 300;

  constructor(
    @Inject('READY_QUEUE_CONNECTION')
    private readonly redis: Redis,
  ) {}

  public async processQueue(sessionId: string): Promise<void> {
    const requestId = uuidv4();

    await this.enqueue(requestId, sessionId);

    await this.waitForPriority(requestId, sessionId);

    await this.redis.del(sessionId, requestId);
  }

  private async waitForPriority(
    requestId: string,
    sessionId: string,
  ): Promise<boolean> {
    while (true) {
      const rank = await this.redis.zrank(sessionId, requestId);

      if (rank === 1) {
        return true;
      }

      await this.sleep(this.INTERVAL);
    }
  }

  private async enqueue(requestId: string, sessionId: string) {
    const timeStamp = new Date().getTime();
    this.redis.zadd(sessionId, timeStamp, requestId);
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
