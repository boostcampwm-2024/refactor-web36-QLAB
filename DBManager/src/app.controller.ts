import { Controller, Delete, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { KubernetesService } from './K8S/KubernetesService';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly kubernetesService: KubernetesService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

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
