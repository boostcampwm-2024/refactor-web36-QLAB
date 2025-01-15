import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { K8SApiService } from './K8SApi/K8SApi.service';

@Controller()
export class AppController {
  constructor(private readonly k8SApiService: K8SApiService) {}

  @Get('/pods')
  async getAllPods() {
    const pods = await this.k8SApiService.getAllPods();
    return pods;
  }

  @Get('/create-pod')
  async createPod() {
    const pod = await this.k8SApiService.createPod();
    return pod;
  }

  @Delete('/delete-pod')
  async deletePod(@Query('podName') podName: string) {
    console.log(podName);
    const pod = await this.k8SApiService.deletePod(podName);
    return pod;
  }
}
