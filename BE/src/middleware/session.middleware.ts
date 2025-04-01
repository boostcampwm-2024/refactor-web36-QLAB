import session from 'express-session';
import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CustomRedisStore } from 'src/config/redisProvider/custom-redis-store';
import { ConfigService } from '@nestjs/config';
import { SessionRepository } from 'src/session/session.manager';

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
        const sessionId = req.sessionID;
        await this.sessionRepository.setSession(sessionId);
        next();
      } catch (error) {
        next(error);
      }
    });
  }
}
