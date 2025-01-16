import session from 'express-session';
import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CustomRedisStore } from 'src/config/redis/custom-redis-store';
import { RedisService } from 'src/config/redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    session({
      secret: this.configService.get<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: true,
      store: new CustomRedisStore(this.redisService),
      rolling: true,
      genid: () => {
        return 'db' + uuidv4().replace(/[^a-zA-Z0-9]/g, '');
      },
      name: 'sid',
    })(req, res, async () => {
      try {
        const sid = req.sessionID;
        const session = await this.redisService.existSession(sid);
        if (!session) {
          await this.redisService.setRowCount(sid, 0);

          const allPods = await this.redisService.getPodList();
          const podList = [];

          for (const podName of allPods) {
            const activeUser = await this.redisService.getActiveUser(podName);
            podList.push({ podName, activeUser });
          }
          podList.sort((a, b) => a.activeUser - b.activeUser);

          const selectedPod = podList[0].podName;
          const selectedPodIp = await this.redisService.getPodIp(selectedPod);
          console.log(selectedPod, selectedPodIp);
          await this.redisService.setPod(sid, selectedPod);
          await this.redisService.setPodIp(sid, selectedPodIp);
        }
        await this.redisService.setSessionTTL(sid);
        next();
      } catch (error) {
        next(error);
      }
    });
  }
}
