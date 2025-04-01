import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { UserDBModule } from '../user-database/user-db.moudle';
import { UsageModule } from '../usage/usage.module';
import { TableModule } from 'src/table/table.module';
import { FileService } from './file.service';
import { RedisModule } from 'src/rate-limiter/redis.module';

@Module({
  imports: [RedisModule, UserDBModule, UsageModule, TableModule],
  controllers: [RecordController],
  providers: [RecordService, FileService],
})
export class RecordModule {}
