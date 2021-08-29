import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateRoleInput {
  @IsUUID()
  @Field(() => String)
  readonly companyUid: string;

  @IsString()
  @Field(() => String)
  readonly code: string;

  @IsString()
  @Field(() => String)
  readonly name: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly description: string;
}
