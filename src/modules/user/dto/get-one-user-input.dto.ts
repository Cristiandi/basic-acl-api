import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class GetOneUserInput {
  @IsString()
  @Field(() => String)
  readonly authUid: string;
}
