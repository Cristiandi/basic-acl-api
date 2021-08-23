import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VoidOutput {
  @Field(() => String)
  readonly message: string;
}
