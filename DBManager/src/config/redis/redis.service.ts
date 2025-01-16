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

  async hgetPod(key: string, field: string): Promise<string | null> {
    return this.podConnection.hget(key, field);
  }

  async hsetPod(key: string, field: string, value: number): Promise<void> {
    await this.podConnection.hset(key, field, value);
  }

  async subscribeSession(
    channel: string,
    onMessage: (message: string) => void,
  ): Promise<void> {
    await this.sessionSubscriber.subscribe(channel);
    this.sessionSubscriber.on('message', (_, message) => {
      onMessage(message);
    });
  }

  async subscribeActiveUser(
    channel: string,
    onMessage: (message: string) => void,
  ): Promise<void> {
    await this.activeUserSubscriber.subscribe(channel);
    this.activeUserSubscriber.on('message', (_, message) => {
      onMessage(message);
    });
  }
}
