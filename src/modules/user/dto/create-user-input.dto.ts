import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateIf,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsUUID()
  @Field(() => String)
  readonly companyUid: string;

  @ValidateIf((o) => !o.email && !o.phone)
  @IsString()
  @Field(() => String, { nullable: true })
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
}
