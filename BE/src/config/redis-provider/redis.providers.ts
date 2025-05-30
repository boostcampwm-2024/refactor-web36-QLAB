import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const RedisProviders: Provider[] = [
  {
    provide: 'REDIS_PROVIDER',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return new Redis({
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: configService.get<number>('REDIS_PORT', 6379),
      });
    },
  },
  {
    provide: 'SUBSCRIBE_PROVIDER',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return new Redis({
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: configService.get<number>('REDIS_PORT', 6379),
      });
    },
  },
];
