import { TemplateType } from '../email-template.entity';

export class GetEmailTemplateStringInput {
  readonly type: TemplateType;

  readonly companyUid?: string;
}
