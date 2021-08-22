import { Module } from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';

import { CompanyModule } from 'src/modules/company/company.module';

@Module({
  imports: [CompanyModule],
  providers: [FirebaseAdminService],
  exports: [FirebaseAdminService],
})
export class FirebaseAdminModule {}
