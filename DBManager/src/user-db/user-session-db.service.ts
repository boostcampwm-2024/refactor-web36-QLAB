import { RedisService } from '../config/redis/redis.service';
import { OnModuleInit } from '@nestjs/common';
import { UserDBConnectionService } from './user-db-connection.service';

export class UserSessionDBService implements OnModuleInit {
  private redisService: RedisService;
  private dbService: UserDBConnectionService;

  onModuleInit() {
    this.createDB();
    this.removeDB();
  }

  private createDB() {
    const channel = '__keyspace@0__:APPEND';
    this.redisService.subscribeSession(channel, async (sessionId) => {
      const pod = await this.redisService.hgetSession(sessionId, 'pod');
      this.dbService.initUserDatabase(pod, sessionId);
    });
  }

  private removeDB() {
    const channel = '__keyspace@0__:EXPIRE';
    this.redisService.subscribeSession(channel, async (sessionId) => {
      const pod = await this.redisService.hgetSession(sessionId, 'pod');
      this.dbService.removeDatabase(pod, sessionId);
    });
  }
}
