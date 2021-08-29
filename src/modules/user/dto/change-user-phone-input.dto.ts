import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@InputType()
export class ChangeUserPhoneInput {
  @IsString()
  @Field(() => String)
  authUid: string;

  @Length(13)
  @IsString()
  @Field(() => String)
  phone: string;
}
