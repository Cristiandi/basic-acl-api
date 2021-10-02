import { Injectable } from '@nestjs/common';

import { CompanyService } from './company.service';

import { GetOneCompanyInput } from '../dto/get-one-company-input.dto';

@Injectable()
export class CompanyExtraService {
  constructor(readonly companyService: CompanyService) {}

  public async getFirebaseAdminConfig(input: GetOneCompanyInput): Promise<any> {
    const { uid } = input;

    const company = await this.companyService.getOne({
      uid,
    });

    const { firebaseAdminConfig } = company;

    return firebaseAdminConfig;
  }

  public async getFirebaseConfig(input: GetOneCompanyInput): Promise<any> {
    const { uid } = input;

    const company = await this.companyService.getOne({
      uid,
    });

    const { firebaseConfig } = company;

    return firebaseConfig;
  }
}
