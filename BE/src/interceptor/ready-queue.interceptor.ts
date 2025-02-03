import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { finalize, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ReadyQueueManager } from '../redis/ready-queue.manager';

@Injectable()
export class ReadyQueueInterceptor implements NestInterceptor {
  constructor(private readonly readyQueueManager: ReadyQueueManager) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const requestId = uuidv4();
    const sessionId = request.sessionID;

    await this.readyQueueManager.enqueue(requestId, sessionId);
    await this.readyQueueManager.waitForPriority(requestId, sessionId);

    return next.handle().pipe(
      finalize(async () => {
        await this.readyQueueManager.dequeue(sessionId);
      }),
    );
  }
}
