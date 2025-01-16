import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { KubernetesService } from './K8S/KubernetesService';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [KubernetesService],
})
export class AppModule {}
