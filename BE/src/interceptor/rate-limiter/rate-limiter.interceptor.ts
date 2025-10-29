import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RateLimiterManager } from './rate-limiter.manager';
import { finalize, Observable } from 'rxjs';
import { QueryLockManager } from '../../config/redis-provider/query-lock.manager';

@Injectable()
export class RateLimiterInterceptor implements NestInterceptor {
  constructor(
    private readonly rateLimiterManager: RateLimiterManager,
    private readonly queryLockManager: QueryLockManager,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const requestTime = Date.now();
    const sessionId = request.sessionID;

    await this.queryLockManager.acquireLock(sessionId);

    let remainTime = await this.rateLimiterManager.getRemainTime(sessionId);
    remainTime = parseFloat(remainTime.toFixed(3));

    request.remainTime = remainTime;

    return next.handle().pipe(
      finalize(async () => {
        const responseTime = parseFloat(
          ((Date.now() - requestTime) / 1000).toFixed(3),
        );
        await this.rateLimiterManager.addResponseTime(
          requestTime,
          sessionId,
          responseTime,
        );
        await this.queryLockManager.releaseLock(sessionId);
      }),
    );
  }
}
