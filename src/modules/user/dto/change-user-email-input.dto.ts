import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class ChangeUserEmailInput {
  @IsString()
  @Field(() => String)
  authUid: string;

  @IsString()
  @Field(() => String)
  email: string;
}
