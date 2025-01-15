import { Controller, Delete, Get, Query } from '@nestjs/common';
import { KubernetesService } from './K8S/KubernetesService';

@Controller()
export class AppController {
  constructor(private readonly kubernetesService: KubernetesService) {}

  @Get('/pods')
  async getAllPods() {
    const pods = await this.kubernetesService.getAllPods();
    return pods;
  }

  @Get('/create-pod')
  async createPod() {
    const pod = await this.kubernetesService.createPod();
    return pod;
  }

  @Delete('/delete-pod')
  async deletePod(@Query('podName') podName: string) {
    console.log(podName);
    const pod = await this.kubernetesService.deletePod(podName);
    return pod;
  }
}
