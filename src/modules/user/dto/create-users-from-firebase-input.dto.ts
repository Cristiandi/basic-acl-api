import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateUsersFromFirebaseInput {
  @IsUUID()
  @Field(() => String)
  readonly companyUid: string;

  @IsString()
  @Field(() => String)
  readonly roleCode: string;
}
