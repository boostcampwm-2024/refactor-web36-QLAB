import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { AdminDBManager } from '../query-database/admin-db-manager.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private sessionConnection: Redis;
  private eventConnection: Redis;
  private activeUserConnection: Redis;

  private readonly SESSION_TTL = 60 * 30;
  private readonly ACTIVE_USER_TTL = 60 * 5;

  constructor(
    private readonly adminDBManager: AdminDBManager,
    private readonly configService: ConfigService,
  ) {
    this.setSessionConnection();
    this.setEventConnection();
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

  private setEventConnection() {
    this.eventConnection = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
    });

    this.eventConnection.on('ready', () => {
      this.subscribeToExpiredEvents();
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
      await this.adminDBManager.initUserDatabase(key);
    }
    await this.sessionConnection.expire(key, this.SESSION_TTL);
  }

  public async deleteSession(key: string) {
    await this.sessionConnection.del(key);
  }

  private subscribeToExpiredEvents() {
    this.eventConnection.subscribe('__keyevent@0__:expired');

    this.eventConnection.on('message', (event, session) => {
      this.adminDBManager.removeDatabaseInfo(session);
    });
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

  public async getConnectedPod(key: string): Promise<string> {
    return this.sessionConnection.hget(key, 'podIp');
  }
}
