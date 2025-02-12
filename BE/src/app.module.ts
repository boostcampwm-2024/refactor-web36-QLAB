import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ShellModule } from './shell/shell.module';
import { QueryModule } from './query/query.module';
import { Shell } from 'src/shell/shell.entity';
import { User } from 'src/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionMiddleware } from './middleware/session.middleware';
import { ServiceDBModule } from './config/service-database/service-db.module';
import { RecordModule } from './record/record.module';
import { TableModule } from './table/table.module';
import { LoggerModule } from './config/logger/logger.module';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { UsageModule } from './usage/usage.module';
import { ConfigModule } from '@nestjs/config';
import { ZodValidationPipe } from 'nestjs-zod';
import { RedisModule } from './redis/redis.module';
import { NginxService } from './nginx/nginx.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([User, Shell]),
    ServiceDBModule,
    UserModule,
    ShellModule,
    QueryModule,
    RecordModule,
    TableModule,
    UsageModule,
    LoggerModule,
    RedisModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    NginxService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
