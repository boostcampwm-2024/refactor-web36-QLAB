import { RedisService } from '../redis/redis.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserDBService } from '../user-db/user-db.service';
@Injectable()
export class SessionEventHandler implements OnModuleInit {
  constructor(
    private readonly redisService: RedisService,
    private readonly userDBService: UserDBService,
  ) {}

  onModuleInit() {
    this.appendEventHandler();
    this.expiredEventHandler();
  }

  private appendEventHandler() {
    const channel = 'newSession';
    this.redisService.subscribeSession(channel, async (sessionId) => {
      const processedKey = `processed:session:${sessionId}`;
      const isProcessed = await this.redisService.setNX(
        processedKey,
        'true',
        3600,
      );
      if (isProcessed) return;

      await this.userDBService.initUserDatabase(sessionId);
    });
  }

  private expiredEventHandler() {
    const channel = '__keyevent@0__:expired';
    this.redisService.subscribeSession(channel, async (key) => {
      if (key.startsWith('session:expiring:')) {
        const sessionId = key.split(':')[2];
        const processedKey = `processed:expired:${sessionId}`;
        const isProcessed = await this.redisService.setNX(
          processedKey,
          'true',
          3600,
        );
        if (isProcessed) return;

        await this.userDBService.removeDatabase(sessionId);
        await this.redisService.removeSession(sessionId);
      }
    });
  }
}
