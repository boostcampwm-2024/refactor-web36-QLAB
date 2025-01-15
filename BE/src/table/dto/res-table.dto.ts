import { Expose } from 'class-transformer';

export class ResTableDto {
  @Expose()
  tableName: string;

  @Expose()
  columns: ColumnDto[];

  constructor(tableName: string, columns: ColumnDto[]) {
    this.tableName = tableName;
    this.columns = columns;
  }
}

export class ColumnDto {
  @Expose()
  name: string;

  @Expose()
  type: string;

  @Expose()
  PK: boolean;

  @Expose()
  FK: string;

  @Expose()
  UQ: boolean;

  @Expose()
  AI: boolean;

  @Expose()
  NN: boolean;

  constructor(init?: Partial<ColumnDto>) {
    Object.assign(this, init);
  }
}
