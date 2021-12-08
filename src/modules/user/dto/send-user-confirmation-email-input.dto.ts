import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class SendUserConfirmationEmailInput {
  @IsOptional()
  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly emailTemplateParams?: Record<string, string>;
}
