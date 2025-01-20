import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private sessionConnection: Redis;
  private activeUserConnection: Redis;
  private podConnection: Redis;

  private readonly SESSION_TTL = 60 * 30;
  private readonly ACTIVE_USER_TTL = 60 * 5;

  constructor(private readonly configService: ConfigService) {
    this.setSessionConnection();
    this.setActiveUserConnection();
    this.setPodConnection();
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

  private setPodConnection() {
    this.podConnection = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      db: this.configService.get<number>('REDIS_DATABASE_POD'),
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

  public async deleteSession(key: string) {
    await this.sessionConnection.del(key);
  }

  public async getRowCount(key: string) {
    return this.sessionConnection.hget(key, 'rowCount');
  }

  public async setRowCount(key: string, rowCount: number) {
    await this.sessionConnection.hset(key, 'rowCount', rowCount);
  }

  public async setPod(key: string, selectedPod: string) {
    await this.sessionConnection.hset(key, 'pod', selectedPod);
  }

  public async setPodIp(key: string, selectedPodIP: string) {
    await this.sessionConnection.hset(key, 'podIP', selectedPodIP);
  }

  public async setSessionTTL(key: string) {
    this.activeUserConnection.expire(key, this.SESSION_TTL);
  }

  public async setActiveUser(key: string) {
    this.activeUserConnection.expire(key, this.ACTIVE_USER_TTL);
  }

  public async getPodList() {
    return this.podConnection.keys('*');
  }

  public async getActiveUser(key: string) {
    const valueStr = await this.podConnection.hget(key, 'activeUser');
    return parseInt(valueStr);
  }

  public async getPodIp(key: string) {
    return this.podConnection.hget(key, 'podIp');
  }

  public async newSessionPublish(key: string) {
    return this.sessionConnection.publish('newSession', key);
  }
}
