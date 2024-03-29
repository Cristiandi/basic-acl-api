import * as DataLoader from 'dataloader';

import { Injectable, Scope } from '@nestjs/common';

import { CompanyService } from '../company/services/company.service';

@Injectable({ scope: Scope.REQUEST })
export class EmailTemplateLoaders {
  constructor(private companyService: CompanyService) {}

  public readonly batchCompanies = new DataLoader(
    async (masterIds: number[]) => {
      const masters = await this.companyService.getByIds(masterIds);
      const mastersMap = new Map(masters.map((item) => [item.id, item]));
      return masterIds.map((masterId) => mastersMap.get(masterId));
    },
  );
}
