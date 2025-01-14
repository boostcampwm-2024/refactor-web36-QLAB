import { Injectable, OnModuleInit } from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';

@Injectable()
export class KubernetesService implements OnModuleInit {
  private podCnt = 0;
  private k8sApi;
  private k8sWatch : k8s.Watch;
  private namespace = 'default';

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
          console.log('Watch Created Pod');
          console.log(watchObj.object.metadata.name);
      } else if (type === 'DELETED') {
          console.log('Watch Deleted Pod');
          console.log(watchObj.object.metadata.name);
      }
    };
    const handleError = (err: any) => {
      console.log(err);
    };

    const req = this.k8sWatch.watch(path, queryParams, handlePodEvent, handleError);
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