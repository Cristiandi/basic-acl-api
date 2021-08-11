import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as cluster from 'cluster';
import * as os from 'os';

const numCPUs = os.cpus().length;

@Injectable()
export class ClusterService {
  // eslint-disable-next-line @typescript-eslint/ban-types
  static clusterize(callback: Function): void {
    console.log('NODE_ENV', process.env.NODE_ENV);

    const isDevEnvironment = process.env.NODE_ENV === 'development';

    if (cluster.isMaster) {
      console.log(`MASTER SERVER (${process.pid}) IS RUNNING `);

      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
      });
    } else {
      callback();
    }
  }
}
