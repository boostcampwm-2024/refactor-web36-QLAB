import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KubernetesService } from './K8S/KubernetesService';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, KubernetesService],
})
export class AppModule {}
