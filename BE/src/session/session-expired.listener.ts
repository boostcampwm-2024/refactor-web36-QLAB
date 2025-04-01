import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { UserDBManager } from '../user-database/user-db.manager';

@Injectable()
export class SessionExpiredListener implements OnModuleInit {
  constructor(
    @Inject('SUBSCRIBE_PROVIDER')
    private readonly redis: Redis,
    private readonly userDBManager: UserDBManager,
  ) {}

  onModuleInit() {
    this.expiredEventHandler();
  }

  private expiredEventHandler() {
    const listening = '__keyevent@0__:expired';

    this.redis.subscribe(listening, (err) => {
      if (err) {
        console.error('Redis subscribe error:', err);
      }
    });

    this.redis.on('message', async (channel, key) => {
      if (channel === listening) {
        if (key.startsWith('session:expiring:')) {
          const sessionId = key.split(':')[2];
          await this.userDBManager.removeConnection(sessionId);
        }
      }
    });
  }
}
