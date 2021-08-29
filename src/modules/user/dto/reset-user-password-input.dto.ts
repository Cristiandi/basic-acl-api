import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class ResetUserPasswordInput {
  @IsString()
  @Field(() => String)
  readonly code: string;

  @IsString()
  @Field(() => String)
  readonly password: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  readonly emailTemplateParams?: Record<string, string>;
}
