import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, HttpStatus, Patch } from '@nestjs/common';

import { UsersService } from './users.service';

import { Public } from 'src/common/decorators/public.decorator';

import { LoginUserInput } from './dto/login-user-input-dto';
import { CreateUsersFromFirebaseInput } from './dto/create-users-from-firebase-input.dto';
import { SetUserAsAdminInput } from './dto/set-user-as-admin-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Public()
  @Post('/login')
  loginUser(@Body() loginUserInput: LoginUserInput): Promise<any> {
    return this.usersService.loginUser(loginUserInput);
  }

  @Public()
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('/create-users-from-firebase')
  createUsersFromFirebase(@Body() createUsersFromFirebaseInput: CreateUsersFromFirebaseInput): Promise<any> {
    return this.usersService.createUsersFromFirebase(createUsersFromFirebaseInput);
  }

  @Public()
  @Patch('/set-user-as-admin')
  setUSerAsAdmin(@Body() setUserAsAdminInput: SetUserAsAdminInput): Promise<any> {
    return this.usersService.setUserAsAdmin(setUserAsAdminInput);
  }

}
