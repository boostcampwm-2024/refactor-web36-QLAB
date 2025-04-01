import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryDto } from './dto/query.dto';
import { ResponseDto } from '../common/response/response.dto';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ResQueryDto } from './dto/res-query.dto';
import { ExecuteQuerySwagger } from '../config/swagger/query-swagger.decorator';
import { Serialize } from '../interceptor/serialize.interceptor';
import { ShellGuard } from '../guard/shell.guard';
import { UserDBConnectionInterceptor } from '../interceptor/user-db-connection.interceptor';
import { RateLimiterGuard } from '../guard/rate-limiter.guard';
import { RateLimiterInterceptor } from '../interceptor/rate-limiter.interceptor';
import { ReadyQueueInterceptor } from '../interceptor/ready-queue.interceptor';

@ApiExtraModels(ResponseDto, ResQueryDto)
@ApiTags('쿼리 API')
@Controller('api/shells')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @UseInterceptors(RateLimiterInterceptor)
  @UseInterceptors(ReadyQueueInterceptor)
  @UseInterceptors(UserDBConnectionInterceptor)
  @ExecuteQuerySwagger()
  @Serialize(ResQueryDto)
  @Post('/:shellId/execute')
  @UseGuards(ShellGuard)
  @UseGuards(RateLimiterGuard)
  async executeQuery(
    @Req() req: any,
    @Param('shellId') shellId: number,
    @Body() queryDto: QueryDto,
  ) {
    return await this.queryService.execute(req.sessionID, shellId, queryDto);
  }
}
