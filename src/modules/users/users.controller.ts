import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';

import { UsersService } from './users.service';

import { Public } from 'src/common/decorators/public.decorator';

import { LoginUserInput } from './dto/login-user-input-dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('users/login')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Public()
  @Post()
  loginUser(@Body() loginUserInput: LoginUserInput): Promise<any> {
    return this.usersService.loginUser(loginUserInput);
  }
}
