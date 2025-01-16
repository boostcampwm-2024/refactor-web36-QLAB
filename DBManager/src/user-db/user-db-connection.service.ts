import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, createConnection } from 'mysql2/promise';

@Injectable()
export class UserDBConnectionService {
  private connectionMap = new Map<string, Connection>();

  constructor(private readonly configService: ConfigService) {}

  private async getConnection(pod: string) {
    if (!this.connectionMap.has(pod)) {
      const connection = await this.createConnectionByPod(pod);
      this.connectionMap.set(pod, connection);
    }
    return this.connectionMap.get(pod);
  }

  private async createConnectionByPod(pod: string) {
    return createConnection({
      host: pod,
      user: this.configService.get<string>('QUERY_DB_USER'),
      password: this.configService.get<string>('QUERY_DB_PASSWORD'),
      port: this.configService.get<number>('QUERY_DB_PORT'),
    });
  }

  public async initUserDatabase(pod: string, sessionId: string) {
    try {
      const identify = sessionId.substring(0, 10);
      const connectInfo = {
        name: identify,
        password: identify,
        host: '%',
        database: identify,
      };

      const connection = await this.getConnection(pod);

      await connection.query(`create database ${connectInfo.database};`);
      await connection.query(
        `create user '${connectInfo.name}'@'${connectInfo.host}' identified by '${connectInfo.password}';`,
      );
      await connection.query(
        `grant all privileges on ${connectInfo.database}.* to '${connectInfo.name}'@'${connectInfo.host}';`,
      );
    } catch (e) {
      console.error(e);
    }
  }

  public async removeDatabase(pod: string, sessionId: string) {
    try {
      const connection = await this.getConnection(pod);

      const identify = sessionId.substring(0, 10);

      const dropDatabase = `drop database ${identify}`;
      await connection.query(dropDatabase);
      const dropUser = `drop user '${identify}'`;
      await connection.query(dropUser);
    } catch (e) {
      console.error(e);
    }
  }
}
