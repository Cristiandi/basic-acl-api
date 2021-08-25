import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

import { TemplateType } from '../../email-template/email-template.entity';

@InputType()
export class ChangeUserEmailInput {
  @IsString()
  @Field(() => String, { description: 'uid from firebase' })
  authUid: string;

  @IsString()
  @Field(() => String, { description: 'new email address' })
  email: string;

  @Field(() => GraphQLJSONObject, {
    nullable: true,
    description: `custom parameters for ${TemplateType.CONFIRMATION_EMAIL}`,
  })
  @IsOptional()
  readonly emailTemplateParams?: Record<string, string>;
}
