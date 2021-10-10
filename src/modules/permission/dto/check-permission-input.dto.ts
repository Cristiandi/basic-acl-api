export class CheckPermissionInput {
  readonly companyUid: string;

  readonly permissionName: string;

  readonly token?: string;

  readonly apiKey?: string;
}
