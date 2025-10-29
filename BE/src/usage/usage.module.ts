import { Module } from '@nestjs/common';
import { UsageController } from './usage.controller';
import { UsageService } from './usage.service';
import { TableModule } from '../table/table.module';
import { UserDBModule } from '../user-db/user-db.module';
import { SessionModule } from '../middleware/session/session.module';

@Module({
  imports: [TableModule, UserDBModule, SessionModule],
  controllers: [UsageController],
  providers: [UsageService],
  exports: [UsageService],
})
export class UsageModule {}
