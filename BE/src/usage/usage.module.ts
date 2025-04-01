import { Module } from '@nestjs/common';
import { UsageController } from './usage.controller';
import { UsageService } from './usage.service';
import { TableModule } from '../table/table.module';
import { UserDBModule } from '../user-database/user-db.moudle';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [TableModule, UserDBModule, SessionModule],
  controllers: [UsageController],
  providers: [UsageService],
  exports: [UsageService],
})
export class UsageModule {}
