import cluster from 'cluster';
import * as os from 'os';

import { Injectable, Logger } from '@nestjs/common';

const numCPUs = os.cpus().length;

@Injectable()
export class ClusterService {
  // eslint-disable-next-line @typescript-eslint/ban-types
  static clusterize(callback: Function): void {
    const isDevEnvironment = process.env.NODE_ENV === 'development';

    if (cluster.isMaster && !isDevEnvironment) {
      Logger.log(
        `MASTER SERVER (${process.pid}) IS RUNNING!`,
        ClusterService.name,
      );

      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        Logger.log(`worker (${worker.process.pid}) died.`, ClusterService.name);
      });
    } else {
      callback();
    }
  }
}
