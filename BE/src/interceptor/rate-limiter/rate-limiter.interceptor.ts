import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RateLimiterManager } from './rate-limiter.manager';
import { finalize, Observable } from 'rxjs';
import { UserDBManager } from '../user-database/user-db.manager';

@Injectable()
export class RateLimiterInterceptor implements NestInterceptor {
  constructor(
    private readonly rateLimiterManager: RateLimiterManager,
    private readonly userDBManager: UserDBManager,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const requestTime = Date.now();
    const sessionId = request.sessionID;
    let remainTime = await this.rateLimiterManager.getRemainTime(sessionId);
    remainTime = parseFloat(remainTime.toFixed(3));

    await this.userDBManager.run(
      sessionId,
      `SET SESSION MAX_EXECUTION_TIME=${remainTime * 1000}`,
    );
    return next.handle().pipe(
      finalize(() => {
        const responseTime = parseFloat(
          ((Date.now() - requestTime) / 1000).toFixed(3),
        );
        this.rateLimiterManager.addResponseTime(
          requestTime,
          sessionId,
          responseTime,
        );
      }),
    );
  }
}
