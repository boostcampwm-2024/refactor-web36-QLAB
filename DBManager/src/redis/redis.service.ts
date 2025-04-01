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

  async getPodIpBySessionId(sessionId: string): Promise<string | null> {
    return this.redisConnection.hget('session:' + sessionId, 'podIp');
  }

  async setPodIp(sessionId: string, podIp: string): Promise<void> {
    await this.redisConnection.hset('session:' + sessionId, 'podIp', podIp);
  }

  async incrActiveUser(podIp: string): Promise<void> {
    await this.redisConnection.zincrby('activeUser', 1, podIp);
  }

  async decrActiveUser(podIp: string): Promise<void> {
    await this.redisConnection.zincrby('activeUser', -1, podIp);
  }

  async initActiveUser(podIp: string): Promise<void> {
    await this.redisConnection.zadd('activeUser', 0, podIp);
  }

  async delPod(podIp: string): Promise<void> {
    await this.redisConnection.zrem('activeUser', podIp);
  }

  async getMinActivUserPod() {
    return this.redisConnection.zrange('activeUser', 0, 0)[0];
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
