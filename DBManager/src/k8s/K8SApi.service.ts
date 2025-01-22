import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from 'src/config/redis/redis.service';
import { CoreV1Api, KubeConfig, Watch } from '@kubernetes/client-node';

@Injectable()
export class K8SApiService implements OnModuleInit {
  private k8sApi: CoreV1Api;
  private k8sWatch: Watch;
  private namespace = 'default';

  constructor(private readonly redisService: RedisService) {}

  async onModuleInit() {
    const kc = new KubeConfig();
    kc.loadFromDefault();
    this.k8sApi = kc.makeApiClient(CoreV1Api);
    this.k8sWatch = new Watch(kc);
    this.startWatchPod();
  }

  async getPodIp(podName: string): Promise<string> {
    const podInfo = await this.k8sApi.readNamespacedPod(
      podName,
      this.namespace,
    );
    return podInfo.body.status.podIP || 'Pending';
  }

  startWatchPod() {
    const path = `/api/v1/namespaces/${this.namespace}/pods`;
    const queryParams = {
      allowWatchBookmarks: true,
      labelSelector: 'app=querydb',
    };
    const handlePodEvent = async (type: string, apiObj: any, watchObj: any) => {
      const podName = watchObj.object.metadata.name;
      const podStatus = watchObj.object.status;
      const curPodIp = await this.redisService.hgetPod(podName, 'podIp');

      if (type === 'ADDED') {
        await this.redisService.hsetPod(podName, 'activeUser', 0);
        await this.redisService.hsetPod(
          podName,
          'podIp',
          podStatus.podIP || '',
        );
      } else if (type === 'MODIFIED' && podStatus.podIP && curPodIp == '') {
        const podIp = podStatus.podIP;
        await this.redisService.hsetPod(podName, 'podIp', podIp);
      } else if (type === 'DELETED') {
        await this.redisService.delPod(podName);
      }
    };

    this.k8sWatch.watch(path, queryParams, handlePodEvent, (err) => {
      console.error(err);
    });
  }

  async createPod() {
    const mysqlPod = {
      metadata: {
        generateName: 'mysql-',
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

    return await this.k8sApi.createNamespacedPod(this.namespace, mysqlPod);
  }

  async deletePod(podName: string) {
    return await this.k8sApi.deleteNamespacedPod(podName, this.namespace);
  }

  async getAllPods() {
    const podList = await this.k8sApi.listNamespacedPod(this.namespace);
    const podResult = {};

    for (const pod of podList.body.items) {
      const podName = pod.metadata.name;
      console.log(podName);

      const podInfo = await this.k8sApi.readNamespacedPod(
        podName,
        this.namespace,
      );
      const podIp = podInfo.body.status.podIP;
      console.log(podIp);

      podResult[podName] = podIp;
    }
    return {
      podCnt: Object.keys(podResult).length,
      podResult,
    };
  }
}
