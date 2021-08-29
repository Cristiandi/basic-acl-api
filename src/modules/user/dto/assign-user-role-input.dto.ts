import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class AssignUserRoleInput {
  @IsString()
  @Field(() => String)
  public userAuthUid: string;

  @IsUUID()
  @Field(() => String)
  public roleUid: string;
}
