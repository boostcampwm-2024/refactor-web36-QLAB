import { UserDBConnector } from './user-db.connector';
import { Injectable } from '@nestjs/common';
import * as console from 'node:console';

@Injectable()
export class UserDBService {
  constructor(private readonly userDBConnector: UserDBConnector) {}

  public async initUserDatabase(sessionId: string) {
    try {
      const identify = sessionId.substring(0, 10);
      const connectInfo = {
        name: identify,
        password: identify,
        host: '%',
        database: identify,
      };

      const connection = await this.userDBConnector.createConnection();

      await connection.query(`create database ${connectInfo.database};`);
      await connection.query(
        `create user '${connectInfo.name}'@'${connectInfo.host}' identified by '${connectInfo.password}';`,
      );
      await connection.query(
        `grant all privileges on ${connectInfo.database}.* to '${connectInfo.name}'@'${connectInfo.host}';`,
      );

      await connection.end();
    } catch (e) {
      console.error(e);
    }
  }

  public async removeDatabase(sessionId: string) {
    try {
      const connection = await this.userDBConnector.createConnection();

      const identify = sessionId.substring(0, 10);

      const dropDatabase = `drop database ${identify}`;
      await connection.query(dropDatabase);
      const dropUser = `drop user '${identify}'`;
      await connection.query(dropUser);

      await connection.end();
    } catch (e) {
      console.error(e);
    }
  }
}
