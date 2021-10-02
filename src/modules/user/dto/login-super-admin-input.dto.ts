import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class LoginSuperAdminInput {
  @IsEmail()
  @Field(() => String)
  readonly email: string;

  @IsString()
  @Field(() => String)
  readonly password: string;
}
