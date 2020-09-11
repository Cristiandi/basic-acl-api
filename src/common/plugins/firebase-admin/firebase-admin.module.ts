import { Module } from '@nestjs/common';

import { CompaniesModule } from '../../../modules/companies/companies.module';

import { FirebaseAdminService } from './firebase-admin.service';
import { COUNTRY_CODES_PHONE_NUMBER, COUNTRY_CODES_PHONE_NUMBER_OBJECT } from './firebase-admin.constants';

@Module({
  imports: [CompaniesModule],
  providers: [
    FirebaseAdminService,
    {
      provide: COUNTRY_CODES_PHONE_NUMBER,
      useFactory: (): typeof COUNTRY_CODES_PHONE_NUMBER_OBJECT => COUNTRY_CODES_PHONE_NUMBER_OBJECT
    }
  ],
  exports: [FirebaseAdminService]
})
export class FirebaseAdminModule {}
