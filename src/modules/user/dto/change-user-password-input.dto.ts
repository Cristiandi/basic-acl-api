import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class ChangeUserPasswordInput {
  @IsString()
  @Field(() => String)
  authUid: string;

  @IsString()
  @Field(() => String)
  oldPassword: string;

  @IsString()
  @Field(() => String)
  newPassword: string;
}
