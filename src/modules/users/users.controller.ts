import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, HttpStatus, Patch, Get, Param, Query, Delete } from '@nestjs/common';

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

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Post()
  create(@Body() createUserInput: CreateUserInput): Promise<any> {
    return this.usersService.create(createUserInput);
  }

  @Get(':companyUuid')
  findAll(
    @Param() findAllUsersParamInput: FindAllUsersParamInput,
    @Query() findAllUsersQueryInput: FindAllUsersQueryInput
  ): Promise<any> {
    return this.usersService.findAll(findAllUsersParamInput, findAllUsersQueryInput);
  }

  @Patch(':companyUuid/:id')
  update(
    @Param() findOneUserInput: FindOneUserInput,
    @Body() updateUserInput: UpdateUserInput
  ): Promise<any> {
    return this.usersService.update(findOneUserInput, updateUserInput);
  }

  @Delete(':companyUuid/:id')
  remove(@Param() findOneUserInput: FindOneUserInput): Promise<any> {
    return this.usersService.remove(findOneUserInput);
  }

  @Public()
  @Post('/login')
  loginUser(@Body() loginUserInput: LoginUserInput): Promise<any> {
    return this.usersService.loginUser(loginUserInput);
  }

  @HitsWatcher(1, 86400)
  @Public()
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('/create-users-from-firebase')
  createUsersFromFirebase(@Body() createUsersFromFirebaseInput: CreateUsersFromFirebaseInput): Promise<any> {
    return this.usersService.createUsersFromFirebase(createUsersFromFirebaseInput);
  }

  @Public()
  @Post('/company-admin')
  createCompanyAdmin(@Body() createCompanyAdminInput: CreateCompanyAdminInput): Promise<any> {
    return this.usersService.createCompanyAdmin(createCompanyAdminInput);
  }

  @Public()
  @Post('/confirmation-email')
  sendConfirmationEmail(@Body() sendConfirmationEmailnput: SendConfirmationEmailnput): Promise<any> {
    return Promise.resolve(sendConfirmationEmailnput);
  }
}
