import { Injectable } from '@nestjs/common';
import { UserDBManager } from '../user-db/user-db.manager';
import { QueryType } from '../common/enums/query-type.enum';

@Injectable()
export class QueryDBService {
  constructor(private readonly userDBManager: UserDBManager) {}

  private isWriteQuery(queryType: string): boolean {
    const writeTypes = [
      'INSERT',
      'UPDATE',
      'DELETE',
      'CREATE',
      'ALTER',
      'DROP',
      'TRUNCATE',
      'RENAME',
    ];
    return writeTypes.includes(queryType);
  }

  async executeWithTransaction<T>(
    sessionId: string,
    queryType: QueryType,
    timeout: number,
    operation: (useMaster: boolean) => Promise<T>,
  ): Promise<T> {
    const isWriteQuery = this.isWriteQuery(queryType);

    // 연결 및 트랜잭션 시작
    await this.userDBManager.setupConnection(sessionId, isWriteQuery, timeout);

    try {
      const result = await operation(isWriteQuery);

      // 성공 시 commit
      await this.userDBManager.commit(sessionId);

      return result;
    } catch (error) {
      // 실패 시 rollback
      await this.userDBManager.rollback(sessionId);
      throw error;
    }
  }
}
