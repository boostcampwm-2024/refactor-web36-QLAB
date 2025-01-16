import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { K8SApiModule } from './k8s/K8SApi.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    K8SApiModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
