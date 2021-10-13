import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateAssignedRoleInput {
  @IsUUID()
  @Field(() => String)
  readonly roleUid: string;

  @IsString()
  @Field(() => String)
  readonly userUid: string;
}
