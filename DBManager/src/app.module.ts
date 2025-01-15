import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { K8SApiModule } from './k8s/K8SApi.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    K8SApiModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
