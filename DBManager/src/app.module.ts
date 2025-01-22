import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { K8SApiModule } from './k8s/K8SApi.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SessionEventModule } from './session/session-event.module';
import { ActiveUserModule } from './active-user/active-user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    K8SApiModule,
    SessionEventModule,
    ActiveUserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
