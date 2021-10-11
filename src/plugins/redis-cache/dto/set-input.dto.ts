export class SetInput {
  readonly keys: Record<string, string | number>;

  readonly value: Record<any, any>;

  ttl?: number;
}
