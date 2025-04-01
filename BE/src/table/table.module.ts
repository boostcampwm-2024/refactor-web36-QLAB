import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { UserDBModule } from '../user-database/user-db.moudle';
import { RateLimiterModule } from 'src/rate-limiter/rateLimiterModule';

@Module({
  imports: [UserDBModule, RateLimiterModule],
  controllers: [TableController],
  providers: [TableService],
  exports: [TableService],
})
export class TableModule {}
