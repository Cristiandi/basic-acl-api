import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class ChangeUserPasswordInput {
  @IsString()
  @Field(() => String)
  authUid: string;

  @IsString()
  @Field(() => String)
  oldPassword: string;

  @IsString()
  @Field(() => String)
  newPassword: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  readonly emailTemplateParams?: Record<string, string>;
}
