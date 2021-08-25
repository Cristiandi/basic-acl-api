import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsUUID } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class SendResetUserPasswordEmailInput {
  @IsUUID()
  @Field(() => String)
  readonly companyUid: string;

  @IsEmail()
  @Field(() => String)
  readonly email: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  readonly emailTemplateParams?: Record<string, string>;
}
