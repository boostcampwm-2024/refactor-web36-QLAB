import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { UserDBModule } from '../config/query-database/user-db.moudle';
import { RedisModule } from 'src/config/redis/redis.module';

@Module({
  imports: [UserDBModule, RedisModule],
  controllers: [TableController],
  providers: [TableService],
  exports: [TableService],
})
export class TableModule {}
