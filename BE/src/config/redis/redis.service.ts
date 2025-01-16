import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private sessionConnection: Redis;
  private activeUserConnection: Redis;

  private readonly SESSION_TTL = 60 * 30;
  private readonly ACTIVE_USER_TTL = 60 * 5;

  constructor(private readonly configService: ConfigService) {
    this.setSessionConnection();
    this.setActiveUserConnection();
  }

  private setSessionConnection() {
    this.sessionConnection = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      db: this.configService.get<number>('REDIS_DATABASE_SESSION'),
    });

    this.sessionConnection.on('ready', () => {
      this.sessionConnection.config('SET', 'notify-keyspace-events', 'Exg');
    });
  }

  private setActiveUserConnection() {
    this.activeUserConnection = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      db: this.configService.get<number>('REDIS_DATABASE_ACTIVE_USER'),
    });
  }

  public async getSession(key: string) {
    if (!key) {
      return null;
    }
    return this.sessionConnection.hgetall(key);
  }

  public async existSession(key: string) {
    return this.sessionConnection.exists(key);
  }

  public async setNewSession(key: string) {
    const session = await this.existSession(key);
    if (!session) {
      await this.sessionConnection.hset(key, 'rowCount', 0);
    }
    await this.sessionConnection.expire(key, this.SESSION_TTL);
  }

  public async deleteSession(key: string) {
    await this.sessionConnection.del(key);
  }

  public async getRowCount(key: string) {
    return this.sessionConnection.hget(key, 'rowCount');
  }

  public async setRowCount(key: string, rowCount: number) {
    await this.sessionConnection.hset(key, 'rowCount', rowCount);
  }

  public async setActiveUser(key: string) {
    this.activeUserConnection.expire(key, this.ACTIVE_USER_TTL);
  }
}
