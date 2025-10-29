import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { UserDBModule } from '../user-db/user-db.module';
import { UsageModule } from '../usage/usage.module';
import { TableModule } from 'src/table/table.module';
import { FileService } from './file.service';
import { RateLimiterModule } from 'src/interceptor/rate-limiter/rate-limiter.module';
import { QueryModule } from '../query/query.module';

@Module({
  imports: [
    RateLimiterModule,
    UserDBModule,
    UsageModule,
    TableModule,
    QueryModule,
  ],
  controllers: [RecordController],
  providers: [RecordService, FileService],
})
export class RecordModule {}
