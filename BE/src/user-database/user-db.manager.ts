import { Injectable } from '@nestjs/common';
import { Connection, createConnection, QueryResult } from 'mysql2/promise';
import { SessionRepository } from '../session/session-repository.service';
import { createReadStream } from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserDBManager {
  constructor(
    private readonly configService: ConfigService,
    private readonly sessionRepository: SessionRepository,
  ) {}

  private connectionMap = new Map<string, Connection>();

  async run(sessionId: string, query: string): Promise<QueryResult> {
    const connection = this.connectionMap.get(sessionId);
    const [result] = await connection.query(query);
    return result;
  }

  async createConnection(sessionId: string): Promise<void> {
    if (!this.connectionMap.has(sessionId)) {
      const podIp = await this.sessionRepository.getConnectedPod(sessionId);
      const identify = sessionId.substring(0, 10);
      const connection = await createConnection({
        host: podIp,
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
