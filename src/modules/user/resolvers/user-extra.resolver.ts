import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { User } from '../user.entity';

import { UserExtraService } from '../services/user-extra.service';

import { Public } from '../../../common/decorators/public.decorator';

import { ChangeUserPhoneInput } from '../dto/change-user-phone-input.dto';
import { ChangeUserEmailInput } from '../dto/change-user-email-input.dto';
import { ChangeUserPasswordInput } from '../dto/change-user-password-input.dto';
import { SendResetUserPasswordEmailInput } from '../dto/send-reset-user-password-input.dto';
import { GetOneUserInput } from '../dto/get-one-user-input.dto';
import { VoidOutput } from '../dto/void-output.dto';
import { ResetUserPasswordInput } from '../dto/reset-user-password-input.dto';
import { ResetUserPasswordOutput } from '../dto/reset-user-password-output.dto';
import { CreateUsersFromFirebaseInput } from '../dto/create-users-from-firebase-input.dto';
import { AssignUserRoleInput } from '../dto/assign-user-role-input.dto';
import { CreateSuperAdmiUserInput } from '../dto/create-super-admin-user-input.dto';
import { LoginSuperAdminInput } from '../dto/login-super-admin-input.dto';
import { LoginSuperAdminOutput } from '../dto/login-super-admin-output.dto';
import { SendUserConfirmationEmailInput } from '../dto/send-user-confirmation-email-input.dto';
import { UnassignUserRoleInput } from '../dto/unassign-user-role-input.dto';
import { GetUsersByAuthUidsInput } from '../dto/get-users-by-auth-uids-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver(() => User)
export class UserExtraResolver {
  constructor(private readonly service: UserExtraService) {}

  @Mutation(() => User, { name: 'changeUserPhone' })
  public changePhone(
    @Args('changeUserPhoneInput') input: ChangeUserPhoneInput,
  ): Promise<User> {
    return this.service.changePhone(input);
  }

  @Mutation(() => User, { name: 'changeUserEmail' })
  public changeEmail(
    @Args('changeUserEmailInput') input: ChangeUserEmailInput,
  ): Promise<User> {
    return this.service.changeEmail(input);
  }

  @Mutation(() => User, { name: 'changeUserPassword' })
  public changePassword(
    @Args('changeUserPasswordInput') input: ChangeUserPasswordInput,
  ): Promise<User> {
    return this.service.changePassword(input);
  }

  @Mutation(() => VoidOutput, { name: 'sendConfirmationUserEmail' })
  public sendConfirmationEmail(
    @Args('getOneUserInput')
    getOneUserInput: GetOneUserInput,
    @Args('sendUserConfirmationEmailInput')
    input: SendUserConfirmationEmailInput,
  ): Promise<VoidOutput> {
    return this.service.sendConfirmationEmail(getOneUserInput, input);
  }

  @Public()
  @Mutation(() => VoidOutput, { name: 'sendResetUserPasswordEmail' })
  public sendResetPasswordEmail(
    @Args('sendResetUserPasswordEmailInput')
    input: SendResetUserPasswordEmailInput,
  ): Promise<VoidOutput> {
    return this.service.sendResetPasswordEmail(input);
  }

  @Public()
  @Mutation(() => ResetUserPasswordOutput, { name: 'resetUserPassword' })
  public resetPassword(
    @Args('resetUserPasswordInput')
    input: ResetUserPasswordInput,
  ): Promise<ResetUserPasswordOutput> {
    return this.service.resetPassword(input);
  }

  @Mutation(() => VoidOutput, { name: 'createUsersFromFirebase' })
  public createUsersFromFirebase(
    @Args('createUsersFromFirebaseInput')
    createUsersFromFirebaseInput: CreateUsersFromFirebaseInput,
  ): VoidOutput {
    return this.service.createUsersFromFirebase(createUsersFromFirebaseInput);
  }

  @Mutation(() => User, { name: 'assignUserRole' })
  public assignRole(
    @Args('assignUserRoleInput') assignUserRoleInput: AssignUserRoleInput,
  ): Promise<User> {
    return this.service.assignRole(assignUserRoleInput);
  }

  @Public()
  @Mutation(() => User, { name: 'createSuperAdmin' })
  public createSuperAdminUser(
    @Args('createSuperAdmiUserInput') input: CreateSuperAdmiUserInput,
  ): Promise<User> {
    return this.service.createSuperAdminUser(input);
  }

  @Public()
  @Mutation(() => LoginSuperAdminOutput, { name: 'loginSuperAdmin' })
  public loginSuperAdmin(
    @Args('loginSuperAdminInput') input: LoginSuperAdminInput,
  ): Promise<LoginSuperAdminOutput> {
    return this.service.loginSuperAdmin(input);
  }

  @Mutation(() => VoidOutput, { name: 'sendSuperAdminConfirmationEmail' })
  public sendSuperAdminConfirmationEmail(
    @Args('getOneUserInput') input: GetOneUserInput,
  ): Promise<VoidOutput> {
    return this.service.sendSuperAdminConfirmationEmail(input);
  }

  @Mutation(() => User, { name: 'unassignUserRole' })
  public unassignRole(
    @Args('unassignUserRoleInput') unassignUserRoleInput: UnassignUserRoleInput,
  ): Promise<User> {
    return this.service.unassignRole(unassignUserRoleInput);
  }

  @Query(() => [User], { name: 'getUsersByAuthUids' })
  public getUsersByAuthUids(
    @Args('getUsersByAuthUidsInput') input: GetUsersByAuthUidsInput,
  ): Promise<User[]> {
    return this.service.getUsersByAuthUids(input);
  }
}
