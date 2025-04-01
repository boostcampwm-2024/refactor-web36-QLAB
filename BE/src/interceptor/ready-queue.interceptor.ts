import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { finalize, Observable } from 'rxjs';
import { ReadyQueueManager } from '../rate-limiter/ready-queue.manager';

@Injectable()
export class ReadyQueueInterceptor implements NestInterceptor {
  constructor(private readonly readyQueueManager: ReadyQueueManager) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const timestamp = Date.now();
    const sessionId = request.sessionID;

    await this.readyQueueManager.enqueue(timestamp, sessionId);
    await this.readyQueueManager.waitForPriority(timestamp, sessionId);

    return next.handle().pipe(
      finalize(async () => {
        await this.readyQueueManager.dequeue(sessionId);
      }),
    );
  }
}
