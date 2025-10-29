import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserDBManager } from './user-db.manager';

@Injectable()
export class UserDBReplicaConnectionInterceptor implements NestInterceptor {
  constructor(private readonly userDBManager: UserDBManager) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    await this.userDBManager.createConnection(request.sessionID, true);
    await this.userDBManager.run(request.sessionID, 'set profiling = 1');

    return next.handle();
  }
}
