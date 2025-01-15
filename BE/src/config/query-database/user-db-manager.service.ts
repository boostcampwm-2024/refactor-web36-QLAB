import { Injectable } from '@nestjs/common';
import { Connection, QueryResult } from 'mysql2/promise';

@Injectable()
export class UserDBManager {
  async run(connection: Connection, query: string): Promise<QueryResult> {
    const [result] = await connection.query(query);
    return result;
  }
}
