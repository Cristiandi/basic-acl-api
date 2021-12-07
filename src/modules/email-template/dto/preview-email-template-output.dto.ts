import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PreviewEmailTemplateOutput {
  @Field(() => String)
  readonly html: string;
}
