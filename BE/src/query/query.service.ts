import { Injectable } from '@nestjs/common';
import { QueryDto } from './dto/query.dto';
import { QueryType } from '../common/enums/query-type.enum';
import { ShellService } from '../shell/shell.service';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { Shell } from '../shell/shell.entity';
import { UserDBManager } from '../user-db/user-db.manager';
import { UsageService } from 'src/usage/usage.service';
import { BadColumnQueryException } from '../common/exception/custom-exception';
import { QueryDBService } from './query-db.service';

@Injectable()
export class QueryService {
  constructor(
    private readonly userDBManager: UserDBManager,
    private shellService: ShellService,
    private readonly usageService: UsageService,
    private readonly queryDBService: QueryDBService,
  ) {}

  async execute(req: any, shellId: number, queryDto: QueryDto) {
    await this.shellService.findShellOrThrow(shellId);
    this.checkColumnTypes(queryDto.query);

    const sessionId = req.sessionID;
    const remainTime = req.remainTime;

    const baseUpdateData = {
      sessionId: sessionId,
      query: queryDto.query,
      queryType: this.detectQueryType(queryDto.query),
    };

    if (baseUpdateData.queryType === QueryType.UNKNOWN) {
      return await this.shellService.replace(shellId, {
        ...baseUpdateData,
        queryStatus: false,
        text: '지원하지 않는 쿼리입니다.',
      });
    }

    try {
      const updateData = await this.queryDBService.executeWithTransaction(
        sessionId,
        baseUpdateData.queryType,
        remainTime * 1000,
        async (useMaster) => {
          return await this.processQuery(
            sessionId,
            baseUpdateData,
            queryDto.query,
            useMaster,
          );
        },
      );

      await this.usageService.updateRowCount(sessionId);
      return await this.shellService.replace(shellId, updateData);
    } catch (e) {
      const text = `ERROR ${e.errno || ''} (${e.sqlState || ''}): ${e.sqlMessage || ''}`;

      const updateData = {
        ...baseUpdateData,
        queryStatus: false,
        failMessage: e.sqlMessage,
        text: text,
      };
      return await this.shellService.replace(shellId, updateData);
    }
  }

  private async processQuery(
    sessionId: string,
    baseUpdateData: any,
    query: string,
    isWriteQuery: boolean,
  ): Promise<Partial<Shell>> {
    const isResultTable = this.existResultTable(baseUpdateData.queryType);
    const useMaster = isWriteQuery;

    const rows = await this.userDBManager.run(sessionId, query, useMaster);
    const runTime = await this.measureQueryRunTime(sessionId, useMaster);

    let text: string;
    let resultTable: RowDataPacket[];

    if (isResultTable) {
      const resultRows = rows as RowDataPacket[];
      const slicedRows = resultRows.slice(0, Math.min(resultRows.length, 100));
      text =
        slicedRows.length === 0
          ? `Empty set (${runTime} sec)`
          : `${resultRows.length} in set, (${runTime} sec)`;
      resultTable = slicedRows;
    } else {
      const resultHeader = rows as ResultSetHeader;
      text = `Query OK, ${resultHeader.affectedRows} rows affected, (${runTime} sec)`;
    }

    return {
      ...baseUpdateData,
      affectedRows: isResultTable ? 0 : (rows as ResultSetHeader).affectedRows,
      countRows: isResultTable ? (rows as RowDataPacket[]).length : 0,
      queryStatus: true,
      resultTable: isResultTable ? resultTable : [],
      runTime,
      text,
    };
  }

  async measureQueryRunTime(
    sessionId: string,
    useMaster: boolean = false,
  ): Promise<string> {
    try {
      const query = `SHOW PROFILES`;
      const rows = (await this.userDBManager.run(
        sessionId,
        query,
        useMaster,
      )) as RowDataPacket[];
      let lastQueryRunTime = rows[rows.length - 1]?.Duration;
      lastQueryRunTime = Math.round(lastQueryRunTime * 1000) / 1000 || 0;
      return lastQueryRunTime.toFixed(3);
    } catch (e) {
      return '0.000';
    }
  }

  private checkColumnTypes(query: string) {
    const FORBIDDEN_COLUMN_TYPES = [
      'TEXT',
      'MEDIUMTEXT',
      'LONGTEXT',
      'BLOB',
      'MEDIUMBLOB',
      'LONGBLOB',
      'JSON',
    ];

    const upperQuery = query.toUpperCase();

    for (const type of FORBIDDEN_COLUMN_TYPES) {
      const pattern = new RegExp(`\\b${type}\\b`, 'i');
      if (pattern.test(upperQuery)) {
        throw new BadColumnQueryException(type);
      }
    }
  }

  private existResultTable(type: QueryType) {
    const validTypes: QueryType[] = [
      QueryType.SELECT,
      QueryType.EXPLAIN,
      QueryType.SHOW,
      QueryType.DESCRIBE,
    ];
    return validTypes.includes(type);
  }

  private detectQueryType(query: string): QueryType | undefined {
    const trimmedQuery = query.trim().toUpperCase();
    const queryType = Object.keys(this.queryTypeMap).find((type) =>
      trimmedQuery.startsWith(type),
    );
    return queryType ? this.queryTypeMap[queryType] : QueryType.UNKNOWN;
  }

  private queryTypeMap: Record<string, QueryType> = {
    SELECT: QueryType.SELECT,
    INSERT: QueryType.INSERT,
    UPDATE: QueryType.UPDATE,
    DELETE: QueryType.DELETE,
    CREATE: QueryType.CREATE,
    DROP: QueryType.DROP,
    ALTER: QueryType.ALTER,
    EXPLAIN: QueryType.EXPLAIN,
    SHOW: QueryType.SHOW,
    TRUNCATE: QueryType.TRUNCATE,
    RENAME: QueryType.RENAME,
    START: QueryType.START,
    COMMIT: QueryType.COMMIT,
    ROLLBACK: QueryType.ROLLBACK,
    SAVEPOINT: QueryType.SAVEPOINT,
    DESCRIBE: QueryType.DESCRIBE,
    DESC: QueryType.DESCRIBE,
    SET: QueryType.SET,
    UNKNOWN: QueryType.UNKNOWN,
  };
}
