import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateSuperAdmiUserInput {
  @IsUUID()
  @Field(() => String, { description: 'uid of the owner company.' })
  readonly companyUid: string;

  @IsEmail()
  @Field(() => String)
  readonly email: string;

  @IsString()
  @Field(() => String)
  readonly password: string;

  @IsString()
  @Field(() => String)
  readonly phone: string;
}
