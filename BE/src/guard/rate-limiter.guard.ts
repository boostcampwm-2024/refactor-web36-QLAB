import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { RateLimiterManager } from '../interceptor/rate-limiter/rate-limiter.manager';
import { RateLimitExceedException } from '../common/exception/custom-exception';

@Injectable()
export class RateLimiterGuard implements CanActivate {
  constructor(private rateLimiterManager: RateLimiterManager) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const sessionId = request.sessionID;

    const remainTime = await this.rateLimiterManager.getRemainTime(sessionId);
    if (remainTime < 0) throw new RateLimitExceedException();
    else return true;
  }
}
