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
    // const domain = `${pod}.default.svc.cluster.local`;
    console.error('QUERY_DB_USER', this.configService.get<string>('QUERY_DB_USER'));
    console.error('QUERY_DB_PASSWORD', this.configService.get<string>('QUERY_DB_PASSWORD'));
    console.error('QUERY_DB_PORT', this.configService.get<number>('QUERY_DB_PORT'));
    console.error("createConnectionByPod", pod);
    console.error()
    return createConnection({
      host: pod,
      user: this.configService.get<string>('QUERY_DB_USER'),
      password: this.configService.get<string>('QUERY_DB_PASSWORD'),
      port: this.configService.get<number>('QUERY_DB_PORT'),
    });
  }
}
