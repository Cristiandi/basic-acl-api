import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class CreateAssignedRoleInput {
  @IsUUID()
  @Field(() => String)
  readonly roleUid: string;

  @IsUUID()
  @Field(() => String)
  readonly userUid: string;
}
