import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SessionEventModule } from './session/session-event.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SessionEventModule,
  ],
  providers: [],
})
export class AppModule {}
