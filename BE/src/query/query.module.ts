import { Module } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryController } from './query.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shell } from '../shell/shell.entity';
import { UsageModule } from '../usage/usage.module';
import { UserDBModule } from '../user-db/user-db.module';
import { ShellModule } from '../shell/shell.module';
import { RateLimiterModule } from 'src/interceptor/rate-limiter/rate-limiter.module';
import { QueryDBService } from './query-db.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shell]),
    UsageModule,
    UserDBModule,
    ShellModule,
    RateLimiterModule,
  ],
  controllers: [QueryController],
  providers: [QueryService, QueryDBService],
  exports: [QueryDBService],
})
export class QueryModule {}
