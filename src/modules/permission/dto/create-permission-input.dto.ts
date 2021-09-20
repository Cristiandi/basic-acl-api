import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreatePermissionInput {
  @IsUUID()
  @Field(() => String)
  readonly projectUid: string;

  @IsOptional()
  @IsUUID()
  @Field(() => String, { nullable: true })
  readonly roleUid: string;

  @IsOptional()
  @IsUUID()
  @Field(() => String, { nullable: true })
  readonly apiKeyUid: string;

  @IsString()
  @Field(() => String)
  readonly name: string;
}
