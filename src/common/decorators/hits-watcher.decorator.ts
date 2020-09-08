import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const HITS_WATCHER = 'hitsWatcher';

export const HitsWatcher = (hitsAllowed: number, timeRange: number): CustomDecorator<string> => SetMetadata(HITS_WATCHER, { hitsAllowed, timeRange });