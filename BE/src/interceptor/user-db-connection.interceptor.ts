import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { DataLimitExceedException } from '../common/exception/custom-exception';
import { UserDBManager } from '../user-database/user-db.manager';

@Injectable()
export class UserDBConnectionInterceptor implements NestInterceptor {
  constructor(private readonly userDBManager: UserDBManager) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    await this.userDBManager.createConnection(request.sessionID);
    await this.userDBManager.run(request.sessionID, 'set profiling = 1');
    await this.userDBManager.startTransaction(request.sessionID);

    return next.handle().pipe(
      tap(async () => {
        await this.userDBManager.commit(request.sessionID);
      }),
      catchError(async (err) => {
        if (err instanceof DataLimitExceedException)
          await this.userDBManager.rollback(request.sessionID);
        throw err;
      }),
    );
  }
}
