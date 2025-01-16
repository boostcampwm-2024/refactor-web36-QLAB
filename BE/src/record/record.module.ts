import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { RedisModule } from '../config/redis/redis.module';
import { UserDBModule } from '../config/query-database/user-db.moudle';
import { UsageModule } from '../usage/usage.module';
import { TableModule } from 'src/table/table.module';
import { FileService } from './file.service';

@Module({
  imports: [RedisModule, UserDBModule, UsageModule, TableModule],
  controllers: [RecordController],
  providers: [RecordService, FileService],
})
export class RecordModule {}
