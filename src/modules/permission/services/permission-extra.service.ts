import { Injectable } from '@nestjs/common';
import { FirebaseAdminService } from 'src/plugins/firebase-admin/firebase-admin.service';

import { PermissionService } from './permission.service';

@Injectable()
export class PermissionExtraService {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly firebaseAdminService: FirebaseAdminService,
  ) {}
}
