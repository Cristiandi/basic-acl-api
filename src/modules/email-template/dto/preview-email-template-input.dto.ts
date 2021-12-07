import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class PreviewEmailTemplateInput {
  @IsOptional()
  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly parameters?: { [key: string]: string };
}
