import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResetUserPasswordOutput {
  @Field(() => String)
  readonly url: string;
}
