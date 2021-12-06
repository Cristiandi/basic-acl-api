import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { TemplateType } from '../email-template.entity';

@InputType()
export class CreateEmailTemplateInput {
  @IsString()
  @Field(() => String)
  readonly companyUid: string;

  @IsEnum(TemplateType, {
    message: () => {
      const keys = Object.keys(TemplateType).filter((x) => !(parseInt(x) >= 0));
      return `type must be one of ${keys.join(', ')}`;
    },
  })
  @Field(() => String)
  readonly type: TemplateType;

  @IsString()
  @Field(() => String)
  readonly subject: string;
}
