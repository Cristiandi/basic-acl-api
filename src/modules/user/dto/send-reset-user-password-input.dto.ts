import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsUUID } from 'class-validator';

@InputType()
export class SendResetUserPasswordEmailInput {
  @IsUUID()
  @Field(() => String)
  readonly companyUid: string;

  @IsEmail()
  @Field(() => String)
  readonly email: string;
}
