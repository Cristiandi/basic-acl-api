import { TemplateType } from '../email-template.entity';

export class GenerateTemplateHtml {
  readonly type: TemplateType;

  readonly companyUid?: string;

  readonly parameters: Record<string, any>;
}
