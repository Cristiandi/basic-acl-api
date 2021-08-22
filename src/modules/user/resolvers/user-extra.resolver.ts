import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { User } from '../user.entity';

import { UserExtraService } from '../services/user-extra.service';

import { ChangeUserPhoneInput } from '../dto/change-user-phone-input.dto';
import { ChangeUserEmailInput } from '../dto/change-user-email-input.dto';
import { ChangeUserPasswordInput } from '../dto/change-user-password-input.dto';

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
}
