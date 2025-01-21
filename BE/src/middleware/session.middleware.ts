import session from 'express-session';
import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CustomRedisStore } from 'src/config/redisProvider/custom-redis-store';
import { ConfigService } from '@nestjs/config';
import { SessionRepository } from 'src/redis/session.repository';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly configService: ConfigService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    session({
      secret: this.configService.get<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: true,
      store: new CustomRedisStore(this.sessionRepository),
      rolling: true,
      genid: () => {
        return 'db' + uuidv4().replace(/[^a-zA-Z0-9]/g, '');
      },
      name: 'sid',
    })(req, res, async () => {
      try {
        const sid = req.sessionID;
        const session = await this.sessionRepository.existSession(sid);
        if (!session) {
          await this.sessionRepository.newSessionPublish(sid);
          await this.sessionRepository.setRowCount(sid, 0);
        }
        await this.sessionRepository.setSessionTTL(sid);
        next();
      } catch (error) {
        next(error);
      }
    });
  }
}
