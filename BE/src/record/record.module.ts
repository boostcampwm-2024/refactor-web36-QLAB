import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { UserDBModule } from '../user-database/user-db.moudle';
import { UsageModule } from '../usage/usage.module';
import { TableModule } from 'src/table/table.module';
import { FileService } from './file.service';
import { RateLimiterModule } from 'src/rate-limiter/rateLimiterModule';

@Module({
  imports: [RateLimiterModule, UserDBModule, UsageModule, TableModule],
  controllers: [RecordController],
  providers: [RecordService, FileService],
})
export class RecordModule {}
