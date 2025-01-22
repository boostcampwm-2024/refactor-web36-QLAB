import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, createConnection } from 'mysql2/promise';

@Injectable()
export class UserDBConnector {
  private connectionMap = new Map<string, Connection>();

  constructor(private readonly configService: ConfigService) {}

  public async getConnection(pod: string) {
    if (!this.connectionMap.has(pod)) {
      const connection = await this.createConnectionByPod(pod);
      this.connectionMap.set(pod, connection);
    }
    return this.connectionMap.get(pod);
  }

  private async createConnectionByPod(pod: string) {
    const domain = `${pod}.default.svc.cluster.local`;
    return createConnection({
      host: domain,
      user: this.configService.get<string>('QUERY_DB_USER'),
      password: this.configService.get<string>('QUERY_DB_PASSWORD'),
      port: this.configService.get<number>('QUERY_DB_PORT'),
    });
  }
}
