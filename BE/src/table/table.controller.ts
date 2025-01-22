import { Controller, Get, Param, Req, UseInterceptors } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { TableService } from './table.service';
import { Serialize } from '../interceptor/serialize.interceptor';
import { ResTableDto } from './dto/res-table.dto';
import { ResTablesDto } from './dto/res-tables.dto';
import {
  GetTableListSwagger,
  GetTableSwagger,
} from '../config/swagger/table-swagger.decorator';
import { ResponseDto } from '../common/response/response.dto';
import { UserDBConnectionInterceptor } from '../interceptor/user-db-connection.interceptor';

@UseInterceptors(UserDBConnectionInterceptor)
@ApiExtraModels(ResponseDto, ResTablesDto, ResTableDto)
@ApiTags('테이블 가져오기 API')
@Controller('api')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @GetTableListSwagger()
  @Serialize(ResTablesDto)
  @Get('/tables')
  async findAll(@Req() req: any) {
    return await this.tableService.findAll(req.dbConnection, req.sessionID);
  }

  @GetTableSwagger()
  @Serialize(ResTableDto)
  @Get('/tables/:tableName')
  async find(@Req() req: any, @Param('tableName') tableName: string) {
    return await this.tableService.find(req.dbConnection, tableName);
  }
}
