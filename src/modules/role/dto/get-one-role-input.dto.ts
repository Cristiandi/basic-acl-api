import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class GetOneRoleInput {
  @IsUUID()
  @Field(() => String)
  readonly uid: string;
}
