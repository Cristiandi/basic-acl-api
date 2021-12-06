import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { TemplateType } from '../email-template.entity';

@InputType()
export class CreateEmailTemplateInput {
  @IsString()
  @Field(() => String)
  readonly companyUid: string;

  @Field(() => String)
  readonly type: TemplateType;

  @IsString()
  @Field(() => String)
  readonly subject: string;
}
