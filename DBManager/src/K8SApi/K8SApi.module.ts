import { Module } from '@nestjs/common';
import { K8SApiService } from './K8SApi.service';

@Module({
  exports: [K8SApiService],
  providers: [K8SApiService],
})
export class K8SApiModule {}
