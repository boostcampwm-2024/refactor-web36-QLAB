import { Module } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryController } from './query.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shell } from '../shell/shell.entity';
import { UsageModule } from '../usage/usage.module';
import { UserDBModule } from '../user-database/user-db.moudle';
import { ShellModule } from '../shell/shell.module';
import { RateLimiterModule } from 'src/rate-limiter/rateLimiterModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shell]),
    UsageModule,
    UserDBModule,
    ShellModule,
    RateLimiterModule,
  ],
  controllers: [QueryController],
  providers: [QueryService],
})
export class QueryModule {}
