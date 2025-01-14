import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { KubernetesService } from './K8S/KubernetesService';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [KubernetesService],
})
export class AppModule {}
