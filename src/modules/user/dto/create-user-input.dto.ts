import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateIf,
} from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreateUserInput {
  @IsUUID()
  @Field(() => String, { description: 'uid of the owner company.' })
  readonly companyUid: string;

  @ValidateIf((o) => !o.email && !o.phone)
  @IsString()
  @Field(() => String, {
    nullable: true,
    description: 'uid of the user in firebase.',
  })
  readonly authUid?: string;

  @IsOptional()
  @IsEmail()
  @Field(() => String, { nullable: true })
  readonly email?: string;

  @ValidateIf((o) => o.email)
  @IsString()
  @Field(() => String, { nullable: true })
  readonly password?: string;

  @IsOptional()
  @Length(13)
  @IsString()
  @Field(() => String, { nullable: true })
  readonly phone?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  readonly emailTemplateParams?: Record<string, string>;
}
