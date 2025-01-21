import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private readonly sessionConnection: Redis;
  private readonly podConnection: Redis;
  private readonly sessionSubscriber: Redis;
  private readonly activeUserSubscriber: Redis;

  constructor(private readonly configService: ConfigService) {
    this.sessionConnection = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      db: this.configService.get<number>('REDIS_DATABASE_SESSION'),
    });

    this.podConnection = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      db: this.configService.get<number>('REDIS_DATABASE_POD'),
    });

    this.sessionSubscriber = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      db: this.configService.get<number>('REDIS_DATABASE_SESSION'),
    });

    this.activeUserSubscriber = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      db: this.configService.get<number>('REDIS_DATABASE_ACTIVE_USER'),
    });
  }

  async hgetSession(key: string, field: string): Promise<string | null> {
    return this.sessionConnection.hget(key, field);
  }

  async hsetSession(key: string, field: string, value: string): Promise<void> {
    await this.sessionConnection.hset(key, field, value);
  }

  async hgetPod(key: string, field: string): Promise<string | null> {
    return this.podConnection.hget(key, field);
  }

  async hsetPod(
    key: string,
    field: string,
    value: number | string,
  ): Promise<void> {
    await this.podConnection.hset(key, field, value);
  }

  async delPod(key: string): Promise<void> {
    await this.podConnection.del(key);
  }

  async keysPod() {
    return this.podConnection.keys('*');
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

  async subscribeActiveUser(
    listening: string,
    onMessage: (message: string) => void,
  ): Promise<void> {
    await this.activeUserSubscriber.subscribe(listening);
    this.sessionSubscriber.on('message', (channel, message) => {
      if (channel === listening) onMessage(message);
    });
  }
}
