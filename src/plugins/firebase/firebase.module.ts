import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { CompanyModule } from '../../modules/company/company.module';

@Module({
  imports: [CompanyModule],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
