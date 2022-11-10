import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class GetUsersByAuthUidsInput {
  @IsString({ each: true })
  @Field(() => [String])
  readonly authUids: string[];
}
