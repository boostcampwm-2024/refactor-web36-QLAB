import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
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

  startWatchPod() {
    const path = `/api/v1/namespaces/${this.namespace}/pods`;
    const queryParams = {
      allowWatchBookmarks: true,
      labelSelector: 'app=querydb',
    };
    const handlePodEvent = async (type: string, apiObj: any, watchObj: any) => {
      const podIp = watchObj.object.status.podIP;

      if ((type == 'ADDED' || type === 'MODIFIED') && podIp) {
        await this.redisService.initActiveUser(podIp);
      } else if (type === 'DELETED') {
        await this.redisService.delPod(podIp);
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

      const podInfo = await this.k8sApi.readNamespacedPod(
        podName,
        this.namespace,
      );
      podResult[podName] = podInfo.body.status.podIP;
    }
    return {
      podCnt: Object.keys(podResult).length,
      podResult,
    };
  }
}
