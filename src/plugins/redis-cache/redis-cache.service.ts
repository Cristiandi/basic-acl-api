import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { md5 } from 'hash-wasm';

import { GetInput } from './dto/get-input.dto';

import { SetInput } from './dto/set-input.dto';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async set(input: SetInput): Promise<void> {
    const { keys, value, ttl = 0 } = input;

    const key = Object.keys(keys)
      .map((key) => keys[key])
      .join(':');

    const md5Key = await md5(key);

    // const newValue = JSON.stringify(value);

    await this.cacheManager.set(md5Key, value, { ttl });
  }

  public async get(input: GetInput): Promise<Record<string, any> | null> {
    const { keys } = input;

    const key = Object.keys(keys)
      .map((key) => keys[key])
      .join(':');

    const md5Key = await md5(key);

    const value = await this.cacheManager.get(md5Key);

    if (!value) return null;

    try {
      JSON.parse(value);
    } catch (error) {
      return value;
    }
  }
}
