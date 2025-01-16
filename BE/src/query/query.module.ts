import { Module } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryController } from './query.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shell } from '../shell/shell.entity';
import { UsageModule } from '../usage/usage.module';
import { RedisModule } from '../config/redis/redis.module';
import { UserDBModule } from '../config/query-database/user-db.moudle';
import { ShellModule } from '../shell/shell.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shell]),
    UsageModule,
    RedisModule,
    UserDBModule,
    ShellModule,
  ],
  controllers: [QueryController],
  providers: [QueryService],
})
export class QueryModule {}
