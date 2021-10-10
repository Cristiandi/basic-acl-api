import { Field, InputType } from '@nestjs/graphql';
import { IsJWT, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

@InputType()
export class CheckPermissionInput {
  @IsString()
  @Field(() => String)
  readonly companyUid: string;

  @IsString()
  @Field(() => String)
  readonly permissionName: string;

  @ValidateIf((o) => !o.apiKey)
  @IsNotEmpty()
  @IsJWT()
  @Field(() => String, { nullable: true })
  readonly token?: string;

  @ValidateIf((o) => !o.token)
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly apiKey?: string;
}
