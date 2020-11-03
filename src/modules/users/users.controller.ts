import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, HttpStatus, Patch, Get, Param, Query, Delete, Redirect } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from './user.entity';

import { UsersService } from './users.service';

import { Public } from '../../common/decorators/public.decorator';

import { LoginUserInput } from './dto/login-user-input-dto';
import { CreateUsersFromFirebaseInput } from './dto/create-users-from-firebase-input.dto';
import { FindAllUsersParamInput } from './dto/find-all-users-param-input.dto';
import { FindAllUsersQueryInput } from './dto/find-all-users-query-input.dto';
import { CreateUserInput } from './dto/create-user-input.dto';
import { FindOneUserInput } from './dto/find-one-user-input.dto';
import { UpdateUserInput } from './dto/update-user-input.dto';
import { CreateCompanyAdminInput } from './dto/create-company-admin-input.dto';
import { HitsWatcher } from '../../common/decorators/hits-watcher.decorator';
import { SendConfirmationEmailnput } from './dto/send-confirmation-email-input.dto';
import { ConfirmEmailInput } from './dto/confirm-email-input.dto';
import { SendForgottenPasswordEmailInput } from './dto/send-forgotten-password-email-input.dto';
import { ChangeForgottenPasswordInput } from './dto/change-forgotten-password-input.dto';
import { LoginAdminOutPut } from './dto/login-admin-output.dto';
import { ChangePasswordInput } from './dto/change-password-input.dto';
import { ChangePhoneInput } from './dto/change-phone-input.dto';

@ApiTags('users')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiResponse({
    status: 200,
    description: 'the item.',
    type: User
  })
  @Post()
  create(@Body() createUserInput: CreateUserInput): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the items.',
    type: [User]
  })
  @Get(':companyUuid')
  findAll(
    @Param() findAllUsersParamInput: FindAllUsersParamInput,
    @Query() findAllUsersQueryInput: FindAllUsersQueryInput
  ): Promise<User[]> {
    return this.usersService.findAll(findAllUsersParamInput, findAllUsersQueryInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the item.',
    type: User
  })
  @Patch(':companyUuid/:id')
  update(
    @Param() findOneUserInput: FindOneUserInput,
    @Body() updateUserInput: UpdateUserInput
  ): Promise<any> {
    return this.usersService.update(findOneUserInput, updateUserInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the item.',
    type: User
  })
  @Delete(':companyUuid/:id')
  remove(@Param() findOneUserInput: FindOneUserInput): Promise<any> {
    return this.usersService.remove(findOneUserInput);
  }

  @ApiResponse({
    status: 200,
    description: 'response.',
    type: LoginAdminOutPut
  })
  @HitsWatcher(10, 60)
  @Public()
  @Post('/login-admin')
  loginAdmin(@Body() loginUserInput: LoginUserInput): Promise<LoginAdminOutPut> {
    return this.usersService.loginAdmin(loginUserInput);
  }

  @HitsWatcher(1, 86400)
  @Public()
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('/create-users-from-firebase')
  createUsersFromFirebase(@Body() createUsersFromFirebaseInput: CreateUsersFromFirebaseInput): Promise<any> {
    return this.usersService.createUsersFromFirebase(createUsersFromFirebaseInput);
  }

  @ApiResponse({
    status: 200,
    description: 'response.',
    type: User
  })
  @Public()
  @Post('/company-admin')
  createCompanyAdmin(@Body() createCompanyAdminInput: CreateCompanyAdminInput): Promise<User> {
    return this.usersService.createCompanyAdmin(createCompanyAdminInput);
  }

  @Public()
  @Post('/confirmation-email')
  sendConfirmationEmail(@Body() sendConfirmationEmailnput: SendConfirmationEmailnput): Promise<any> {
    return this.usersService.sendConfirmationEmail(sendConfirmationEmailnput);
  }

  @Public()
  @Redirect('https://nestjs.com', 302)
  @Get('/confirmation-email-code')
  confirmEmail(@Query() confirmEmailInput: ConfirmEmailInput): Promise<any> {
    return this.usersService.confirmEmail(confirmEmailInput);
  }

  @Public()
  @Post('/forgotten-password')
  sendForgottentPasswordEmail(@Body() sendForgottenPasswordEmailInput: SendForgottenPasswordEmailInput): Promise<any> {
    return this.usersService.sendForgottentPasswordEmail(sendForgottenPasswordEmailInput);
  }

  @Public()
  @Post('/forgotten-password-code')
  changeForgottenPassword(@Body() changeForgottenPasswordInput: ChangeForgottenPasswordInput): Promise<any> {
    return this.usersService.changeForgottenPassword(changeForgottenPasswordInput);
  }

  @Post('/change-password')
  changePassword(@Body() changePasswordInput: ChangePasswordInput): Promise<any> {
    return this.usersService.changePassword(changePasswordInput);
  }

  @ApiResponse({
    status: 200,
    description: 'response.',
    type: User
  })
  @Patch('/change-phone')
  changePhone(@Body() changePhoneInput: ChangePhoneInput): Promise<User> {
    return this.usersService.changePhone(changePhoneInput);
  }
}
