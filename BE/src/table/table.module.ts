import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { UserDBModule } from '../user-database/user-db.moudle';
import { RedisModule } from 'src/rate-limiter/redis.module';

@Module({
  imports: [UserDBModule, RedisModule],
  controllers: [TableController],
  providers: [TableService],
  exports: [TableService],
})
export class TableModule {}
