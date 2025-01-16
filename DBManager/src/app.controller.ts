import { Controller, Delete, Get, Query } from '@nestjs/common';
import { K8SApiService } from './k8s/K8SApi.service';

@Controller()
export class AppController {
  constructor(private readonly k8SApiService: K8SApiService) {}

  @Get('/pods')
  async getAllPods() {
    return await this.k8SApiService.getAllPods();
  }

  @Get('/create-pod')
  async createPod() {
    return await this.k8SApiService.createPod();
  }

  @Delete('/delete-pod')
  async deletePod(@Query('podName') podName: string) {
    return await this.k8SApiService.deletePod(podName);
  }
}
