import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginSuperAdminOutput {
  @Field(() => String)
  readonly companyUid: string;

  @Field(() => String)
  readonly accessKey: string;

  @Field(() => String)
  readonly token: string;

  @Field(() => String)
  readonly authTime: string;

  @Field(() => String)
  readonly issuedAtTime: string;

  @Field(() => String)
  readonly expirationTime: string;
}
