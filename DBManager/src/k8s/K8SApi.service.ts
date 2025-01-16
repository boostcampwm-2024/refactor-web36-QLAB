import { Injectable, OnModuleInit } from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';
import { RedisService } from 'src/config/redis/redis.service';

@Injectable()
export class K8SApiService {
  private podCnt = 0;
  private k8sApi;
  private k8sWatch : k8s.Watch;
  private namespace = 'default';

  constructor(private readonly redisService: RedisService) {}

  async onModuleInit() {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    this.k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    this.k8sWatch = new k8s.Watch(kc);
    this.startWatchPod();
  }
  
  async getPodIp(podName: string): Promise<string> {
    const podInfo = await this.k8sApi.readNamespacedPod(podName, this.namespace);
    return podInfo.body.status.podIP || 'Pending';
  }

  startWatchPod() {
    const path = `/api/v1/namespaces/${this.namespace}/pods`;
    const queryParams = {
      allowWatchBookmarks: true,
      labelSelector: 'app=mysql',
    };
    const handlePodEvent = async (type : String, apiObj: any, watchObj: any) => {
      const podName = watchObj.object.metadata.name;
      const podStatus = watchObj.object.status;
      const curPodIp = await this.redisService.hgetPod(podName, 'podIp');

      if (type === 'ADDED') {
          await this.redisService.hsetPod(podName, 'activeUser', 0);
          await this.redisService.hsetPod(podName, 'podIp', podStatus.podIp || '');
      } else if (type === 'MODIFIED' && podStatus.podIP && curPodIp == '') {
        const podIp = podStatus.podIP;
        await this.redisService.hsetPod(podName, 'podIp', podIp);
      } else if (type === 'DELETED') {
          await this.redisService.delPod(podName);
      }
    };
    

    this.k8sWatch.watch(path, queryParams, handlePodEvent, err => {});
  }

  async createPod() {
    const podName = `mysql-pod${this.podCnt++}`;
    const mysqlPod = {
      metadata: {
        name: podName,
        labels: {
          app: 'mysql',
        },
      },
      spec: {
        containers: [
          {
            name: 'mysql',
            image: 'mysql',
          },
        ],
      },
    };

    const createdPod = await this.k8sApi.createNamespacedPod(this.namespace, mysqlPod);
    return createdPod;
  }

  async deletePod(podName: string) {
    const deletePod = await this.k8sApi.deleteNamespacedPod(podName, this.namespace);
    return deletePod;
  }

  async getAllPods() {
    const podList = await this.k8sApi.listNamespacedPod(this.namespace);
    const podResult = {};

    for (const pod of podList.body.items) {
      const podName = pod.metadata.name;
      console.log(podName);
  
      const podInfo = await this.k8sApi.readNamespacedPod(podName, this.namespace);
      const podIp = podInfo.body.status.podIP;
      console.log(podIp);
  
      podResult[podName] = podIp;
    }
    return {
      podCnt : Object.keys(podResult).length,
      podResult,
    };
  }
}