import { Module } from '@nestjs/common';
import { UsageController } from './usage.controller';
import { UsageService } from './usage.service';
import { TableModule } from '../table/table.module';
import { UserDBModule } from '../config/query-database/user-db.moudle';
import { RepositoriesModule } from 'src/repositories/repositories.module';

@Module({
  imports: [TableModule, UserDBModule, RepositoriesModule],
  controllers: [UsageController],
  providers: [UsageService],
  exports: [UsageService],
})
export class UsageModule {}
