import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class GetAllProjectsInput {
  @IsUUID()
  @Field(() => String)
  readonly companyUid: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  readonly limit?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  readonly skip?: number;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly q?: string;
}
