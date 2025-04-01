import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class ReadyQueueManager {
  private readonly INTERVAL = 300;

  constructor(private readonly redis: Redis) {}

  public async enqueue(timestamp: number, sessionId: string): Promise<void> {
    await this.redis.rpush(sessionId, timestamp);
  }

  public async waitForPriority(
    timestamp: number,
    sessionId: string,
  ): Promise<void> {
    while (true) {
      const firstRequest = await this.redis.lindex(sessionId, 0);
      if (firstRequest === timestamp.toString()) return;

      const ONE_MINUTE_AGO = Date.now() - 60000;

      if (timestamp < ONE_MINUTE_AGO) {
        await this.redis.lpop(sessionId);
        continue;
      }

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
