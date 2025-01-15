import { Injectable } from '@nestjs/common';
import { UserDBManager } from '../config/query-database/user-db-manager.service';
import { Connection, RowDataPacket } from 'mysql2/promise';
import { ColumnDto, ResTableDto } from './dto/res-table.dto';
import { ResTablesDto } from './dto/res-tables.dto';

@Injectable()
export class TableService {
  constructor(private readonly userDBManager: UserDBManager) {}

  async findAll(connection: Connection, sessionId: string) {
    const tables = await this.getTables(connection, sessionId);

    const tableList: ResTableDto[] = [];
    for (const tableName of tables) {
      const columnDtos = await this.getColumns(connection, tableName);
      const resTableDto = new ResTableDto(tableName, columnDtos);
      tableList.push(resTableDto);
    }
    return new ResTablesDto(tableList);
  }

  async find(connection: Connection, tableName: string) {
    const columns = await this.getColumns(connection, tableName);
    return new ResTableDto(tableName, columns);
  }

  async getTables(
    connection: Connection,
    sessionId: string,
  ): Promise<string[]> {
    const query = `SHOW TABLES`;
    const result = (await this.userDBManager.run(
      connection,
      query,
    )) as RowDataPacket[];

    const schema = sessionId.substring(0, 10);
    const key = `Tables_in_${schema}`;

    return result.map((row) => row[key]);
  }

  async getColumns(connection: Connection, tableName: string) {
    const query = `SHOW FULL COLUMNS FROM ${tableName}`;
    const result = (await this.userDBManager.run(
      connection,
      query,
    )) as RowDataPacket[];
    return result.map(
      (row) =>
        new ColumnDto({
          name: row.Field,
          type: row.Type,
          PK: row.Key === 'PRI',
          UQ: row.Key === 'UNI',
          AI: row.Extra.includes('auto_increment'),
          NN: row.Null !== 'YES',
        }),
    );
  }
}
