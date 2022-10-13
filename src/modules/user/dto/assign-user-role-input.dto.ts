import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID, ValidateIf } from 'class-validator';

@InputType()
export class AssignUserRoleInput {
  @IsString()
  @Field(() => String)
  readonly userAuthUid: string;

  @ValidateIf((o) => !o.companyUid && !o.roleUid)
  @IsUUID()
  @Field(() => String, { nullable: true })
  readonly roleUid?: string;

  @ValidateIf((o) => !!o.roleCode)
  @IsUUID()
  @Field(() => String, { nullable: true })
  readonly companyUid?: string;

  @ValidateIf((o) => !!o.companyUid)
  @IsString()
  @Field(() => String, {
    nullable: true,
  })
  readonly roleCode?: string;
}
