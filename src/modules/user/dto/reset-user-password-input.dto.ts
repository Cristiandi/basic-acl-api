import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class ResetUserPasswordInput {
  @IsString()
  @Field(() => String)
  readonly code: string;

  @IsString()
  @Field(() => String)
  readonly password: string;
}
