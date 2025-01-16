import { RedisService } from '../config/redis/redis.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserDBService } from '../user-db/user-db.service';

@Injectable()
export class SessionEventHandler implements OnModuleInit {
  constructor(
    private readonly redisService: RedisService,
    private readonly userDBService: UserDBService,
  ) {}

  onModuleInit() {
    this.createDB();
    this.removeDB();
  }

  private createDB() {
    const channel = '__keyspace@0__:APPEND';
    this.redisService.subscribeSession(channel, async (sessionId) => {
      const pod = await this.redisService.hgetSession(sessionId, 'pod');
      this.userDBService.initUserDatabase(pod, sessionId);
    });
  }

  private removeDB() {
    const channel = '__keyspace@0__:EXPIRE';
    this.redisService.subscribeSession(channel, async (sessionId) => {
      const pod = await this.redisService.hgetSession(sessionId, 'pod');
      this.userDBService.removeDatabase(pod, sessionId);
    });
  }
}
