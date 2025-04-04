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

  async getPodDNSBySessionId(sessionId: string): Promise<string | null> {
    return this.redisConnection.hget('session:' + sessionId, 'podDNS');
  }

  async setPodDNS(sessionId: string, podDNS: string): Promise<void> {
    await this.redisConnection.hset('session:' + sessionId, 'podDNS', podDNS);
  }

  async incrActiveUser(podDNS: string): Promise<void> {
    await this.redisConnection.zincrby('activeUser', 1, podDNS);
  }

  async decrActiveUser(podDNS: string): Promise<void> {
    await this.redisConnection.zincrby('activeUser', -1, podDNS);
  }

  async initActiveUser(podDNS: string): Promise<void> {
    await this.redisConnection.zadd('activeUser', 0, podDNS);
  }

  async delPod(podDNS: string): Promise<void> {
    await this.redisConnection.zrem('activeUser', podDNS);
  }

  async getMinActivUserPod() {
    return (await this.redisConnection.zrange('activeUser', 0, 0))[0];
  }

  async removeSession(sessionId: string): Promise<void> {
    await this.redisConnection.del('session:' + sessionId);
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
