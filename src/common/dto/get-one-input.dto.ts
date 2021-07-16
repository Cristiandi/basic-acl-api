export class GetOneByOneFieldInput {
  readonly fields: Record<string, any>;

  readonly relations?: string[];

  readonly checkIfExists?: boolean;
}
