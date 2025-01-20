import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { UserDBModule } from '../config/query-database/user-db.moudle';
import { RepositoriesModule } from 'src/redis-repositories/repositories.module';

@Module({
  imports: [UserDBModule, RepositoriesModule],
  controllers: [TableController],
  providers: [TableService],
  exports: [TableService],
})
export class TableModule {}
