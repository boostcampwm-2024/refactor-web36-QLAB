import { Module } from '@nestjs/common';
import { UsageController } from './usage.controller';
import { UsageService } from './usage.service';
import { TableModule } from '../table/table.module';
import { UserDBModule } from '../config/query-database/user-db.moudle';

@Module({
  imports: [TableModule, UserDBModule],
  controllers: [UsageController],
  providers: [UsageService],
  exports: [UsageService],
})
export class UsageModule {}
