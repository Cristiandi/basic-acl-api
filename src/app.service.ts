import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      name: 'basic-acl-api',
      message: `Hey Folks ${new Date().toISOString()}`,
    };
  }
}
