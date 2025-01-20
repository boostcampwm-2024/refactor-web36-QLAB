import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

const createRedisConnection = (
  configService: ConfigService,
  dbName: string,
): Redis => {
  return new Redis({
    host: configService.get<string>('REDIS_HOST'),
    port: configService.get<number>('REDIS_PORT'),
    db: configService.get<number>(dbName),
  });
};

export const RedisProviders: Provider[] = [
  {
    provide: 'SESSION_STORE_CONNECTION',
    useFactory: (configService: ConfigService) =>
      createRedisConnection(configService, 'REDIS_DATABASE_SESSION'),
    inject: [ConfigService],
  },
  {
    provide: 'POD_STORE_CONNECTION',
    useFactory: (configService: ConfigService) =>
      createRedisConnection(configService, 'REDIS_DATABASE_POD'),
    inject: [ConfigService],
  },
  {
    provide: 'ACTIVE_USER_STORE_CONNECTION',
    useFactory: (configService: ConfigService) =>
      createRedisConnection(configService, 'REDIS_DATABASE_ACTIVE_USER'),
    inject: [ConfigService],
  },
];
