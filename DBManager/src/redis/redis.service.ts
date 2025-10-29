import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private readonly redisConnection: Redis;
  private readonly sessionSubscriber: Redis;

  constructor(private readonly configService: ConfigService) {
    this.redisConnection = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
    });
    this.sessionSubscriber = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
    });
  }

  async removeSession(sessionId: string): Promise<void> {
    await this.redisConnection.del('session:' + sessionId);
    await this.redisConnection.del('rateLimiter:' + sessionId);
  }

  async setNX(key: string, value: string, ttl: number): Promise<boolean> {
    const result = await this.redisConnection.set(key, value, 'EX', ttl, 'NX');
    return result !== 'OK';
  }

  async subscribeSession(
    listening: string,
    onMessage: (message: string) => void,
  ): Promise<void> {
    await this.sessionSubscriber.subscribe(listening);
    this.sessionSubscriber.on('message', (channel, message) => {
      if (channel === listening) onMessage(message);
    });
  }
}
