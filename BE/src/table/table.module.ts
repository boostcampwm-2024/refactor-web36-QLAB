import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { UserDBModule } from '../interceptor/user-database/user-db.moudle';
import { RateLimiterModule } from 'src/interceptor/rate-limiter/rate-limiter.module';

@Module({
  imports: [UserDBModule, RateLimiterModule],
  controllers: [TableController],
  providers: [TableService],
  exports: [TableService],
})
export class TableModule {}
