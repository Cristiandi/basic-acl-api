import { TemplateType } from '../email-template.entity';

export class GenerateTemplateHtmlInput {
  readonly type: TemplateType;

  readonly companyUid?: string;

  readonly parameters: Record<string, any>;
}
