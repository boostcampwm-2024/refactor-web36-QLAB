import { Injectable, OnModuleInit } from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';

@Injectable()
export class KubernetesService implements OnModuleInit {
  private podCnt = 0;
  private k8sApi;
  private namespace = 'default';

  async onModuleInit() {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    this.k8sApi = kc.makeApiClient(k8s.CoreV1Api);
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

    const createdPod = await this.k8sApi.createNamespacedPod({
      namespace: this.namespace,
      body: mysqlPod,
    });
    console.log('Created pod:', createdPod);
    return createdPod;
  }

  async deletePod(podName: string) {
    const deletePod = await this.k8sApi.deleteNamespacedPod({
      namespace: this.namespace,
      name: podName,
    });
    console.log('Deleted pod:', deletePod);
    return deletePod;
  }

  async getAllPods() {
    const allPodInfos = await this.k8sApi.listNamespacedPod({ namespace: this.namespace });

    const podNameList = [];
    allPodInfos.items.forEach(item => {
      podNameList.push(item.metadata.name);
    });
    return {
      podCnt : podNameList.length,
      podNameList,
    };
  }
}