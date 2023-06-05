import { Inject, Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { md5 } from 'hash-wasm';
import { createClient, RedisClientType } from 'redis';

import appConfig from '../../config/app.config';

import { GetInput } from './dto/get-input.dto';
import { SetInput } from './dto/set-input.dto';

const KEY_PREFIX = 'basic_acl';

@Injectable()
export class RedisCacheService {
  private client: RedisClientType;

  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
  ) {
    this.init();
  }

  private async init() {
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
      },
      password: process.env.REDIS_PASSWORD,
    });

    this.client.on('error', (err) => {
      Logger.error(`Redis Client Error: ${err}`, RedisCacheService.name);
      throw err;
    });

    await this.client.connect();
  }

  private async getKey(keys: Record<string, string | number>): Promise<string> {
    const { environment } = this.appConfiguration;

    const result = await Promise.all(
      Object.keys(keys).map((key) => {
        if (key === 'token') {
          return md5(keys[key] as string);
        }
        return keys[key];
      }),
    );

    const key = result.join(':');

    return KEY_PREFIX + ':' + environment + ':' + key;
  }

  public async set(input: SetInput): Promise<void> {
    const { keys, value, ttl = 0 } = input;

    const key = await this.getKey(keys);

    const newValue = JSON.stringify(value);

    await this.client.set(key, newValue, {
      EX: ttl,
      NX: true,
    });
  }

  public async get(input: GetInput): Promise<Record<string, any> | undefined> {
    const { keys } = input;

    const key = await this.getKey(keys);

    const value: string = await this.client.get(key);

    if (!value) return undefined;

    try {
      JSON.parse(value);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
