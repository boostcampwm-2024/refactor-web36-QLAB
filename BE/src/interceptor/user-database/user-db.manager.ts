import { Injectable } from '@nestjs/common';
import { Connection, createConnection, QueryResult } from 'mysql2/promise';
import { SessionRepository } from '../../middleware/session/session.manager';
import { createReadStream } from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserDBManager {
  constructor(
    private readonly configService: ConfigService,
    private readonly sessionRepository: SessionRepository,
  ) {}

  private connectionMap = new Map<string, Connection>();
  private connectionTypeMap = new Map<string, boolean>(); // sessionId -> useReplica

  private getConnectionKey(sessionId: string): string {
    // 현재 session에 대해 replica 연결인지 확인
    const useReplica = this.connectionTypeMap.get(sessionId) || false;
    return useReplica ? `${sessionId}_replica` : `${sessionId}_master`;
  }

  async run(sessionId: string, query: string): Promise<QueryResult> {
    const key = this.getConnectionKey(sessionId);
    const connection = this.connectionMap.get(key);
    try {
      await connection.ping();
    } catch (err) {
      this.connectionMap.delete(key);
      const useReplica = this.connectionTypeMap.get(sessionId) || false;
      await this.createConnection(sessionId, useReplica);
    }
    const [result] = await connection.query(query);
    return result;
  }

  async createConnection(
    sessionId: string,
    useReplica: boolean = false,
  ): Promise<void> {
    const key = useReplica ? `${sessionId}_replica` : `${sessionId}_master`;

    if (!this.connectionMap.has(key)) {
      const identify = sessionId.substring(0, 10);
      const host = useReplica
        ? this.configService.get<string>('QUERY_DB_REPLICA_HOST', '127.0.0.1')
        : this.configService.get<string>('QUERY_DB_HOST', '127.0.0.1');

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
      this.connectionMap.set(key, connection);
      this.connectionTypeMap.set(sessionId, useReplica);
    }
  }

  async removeConnection(sessionId: string): Promise<void> {
    // master와 replica 둘 다 제거
    for (const key of [`${sessionId}_master`, `${sessionId}_replica`]) {
      if (this.connectionMap.has(key)) {
        const connection = this.connectionMap.get(key);
        await connection.end();
        this.connectionMap.delete(key);
      }
    }
    this.connectionTypeMap.delete(sessionId);
  }

  async startTransaction(sessionId: string): Promise<void> {
    const key = this.getConnectionKey(sessionId);
    if (this.connectionMap.has(key)) {
      const connection = this.connectionMap.get(key);
      await connection.beginTransaction();
    }
  }

  async commit(sessionId: string): Promise<void> {
    const key = this.getConnectionKey(sessionId);
    if (this.connectionMap.has(key)) {
      const connection = this.connectionMap.get(key);
      await connection.commit();
    }
  }

  async rollback(sessionId: string): Promise<void> {
    const key = this.getConnectionKey(sessionId);
    if (this.connectionMap.has(key)) {
      const connection = this.connectionMap.get(key);
      await connection.rollback();
    }
  }
}
