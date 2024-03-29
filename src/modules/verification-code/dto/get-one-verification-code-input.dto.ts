import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class GetOneVerificationCodeInput {
  @IsString()
  @Field(() => String)
  readonly uid: string;
}
