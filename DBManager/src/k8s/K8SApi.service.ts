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

  startWatchPod() {
    const path = `/api/v1/namespaces/${this.namespace}/pods`;
    const queryParams = { allowWatchBookmarks: true };
    const handlePodEvent = (type : String, apiObj: any, watchObj: any) => {
      if (type === 'ADDED') {
          const createdPod = watchObj.object.metadata.name;
          this.redisService.hsetPod(createdPod, 'activeUser', 0);
      } else if (type === 'DELETED') {
          const deletedPod = watchObj.object.metadata.name;
          this.redisService.delPod(deletedPod);
      }
    };

    this.k8sWatch.watch(path, queryParams, handlePodEvent, err => {});
  }

  async createPod() {
    const mysqlPod = {
      metadata: {
        name: `mysql-pod${this.podCnt++}`,
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
    const allPodInfos = await this.k8sApi.listNamespacedPod(this.namespace);
    const podNameList = [];
    allPodInfos.body.items.forEach(item => {
      podNameList.push(item.metadata.name);
    });
    return {
      podCnt : podNameList.length,
      podNameList,
    };
  }
}