import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { K8SApiModule } from './K8SApi/K8SApi.module';

@Module({
  imports: [K8SApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
