import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateApiKeyInput {
  @IsUUID()
  @Field(() => String)
  readonly companyUid: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly alias?: string;
}
