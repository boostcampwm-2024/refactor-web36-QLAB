import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createConnection } from 'mysql2/promise';

@Injectable()
export class UserDBConnector {
  constructor(private readonly configService: ConfigService) {}

  public async createConnection(podIp: string) {
    const connection = await createConnection({
      host: podIp,
      user: this.configService.get<string>('QUERY_DB_USER'),
      password: this.configService.get<string>('QUERY_DB_PASSWORD'),
      port: this.configService.get<number>('QUERY_DB_PORT'),
    });
    console.error(connection);
    return connection;
  }
}
