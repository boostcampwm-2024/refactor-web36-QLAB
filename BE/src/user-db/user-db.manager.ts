import { Injectable } from '@nestjs/common';
import { Connection, createConnection, QueryResult } from 'mysql2/promise';
import { createReadStream } from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserDBManager {
  constructor(private readonly configService: ConfigService) {}

  private connectionMap = new Map<string, Connection>();

  async run(
    sessionId: string,
    query: string,
    useMaster: boolean = false,
  ): Promise<QueryResult> {
    const connection = this.connectionMap.get(sessionId);
    try {
      await connection.ping();
    } catch (err) {
      this.connectionMap.delete(sessionId);
      await this.createConnection(sessionId, useMaster);
    }
    const [result] = await connection.query(query);
    return result;
  }

  async createConnection(
    sessionId: string,
    useMaster: boolean = false,
  ): Promise<void> {
    if (!this.connectionMap.has(sessionId)) {
      const identify = sessionId.substring(0, 10);
      const host = useMaster
        ? this.configService.get<string>('QUERY_DB_HOST', '127.0.0.1')
        : this.configService.get<string>('QUERY_DB_REPLICA_HOST', '127.0.0.1');

      const connection = await createConnection({
        host,
        user: identify,
        password: identify,
        port: this.configService.get<number>('QUERY_DB_PORT', 3306),
        database: identify,
        infileStreamFactory: (path) => {
          return createReadStream(path);
        },
      });
      this.connectionMap.set(sessionId, connection);
    }
  }

  async setupConnection(
    sessionId: string,
    useMaster: boolean,
    timeout: number,
  ): Promise<void> {
    await this.createConnection(sessionId, useMaster);
    await this.run(
      sessionId,
      `SET SESSION MAX_EXECUTION_TIME=${timeout}`,
      useMaster,
    );
    await this.run(sessionId, 'set profiling = 1', useMaster);
    await this.startTransaction(sessionId);
  }

  async removeConnection(sessionId: string): Promise<void> {
    if (this.connectionMap.has(sessionId)) {
      const connection = this.connectionMap.get(sessionId);
      await connection.end();
      this.connectionMap.delete(sessionId);
    }
  }

  async startTransaction(sessionId: string): Promise<void> {
    if (this.connectionMap.has(sessionId)) {
      const connection = this.connectionMap.get(sessionId);
      await connection.beginTransaction();
    }
  }

  async commit(sessionId: string): Promise<void> {
    if (this.connectionMap.has(sessionId)) {
      const connection = this.connectionMap.get(sessionId);
      await connection.commit();
    }
  }

  async rollback(sessionId: string): Promise<void> {
    if (this.connectionMap.has(sessionId)) {
      const connection = this.connectionMap.get(sessionId);
      await connection.rollback();
    }
  }
}
