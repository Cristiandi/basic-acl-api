import {
  Controller,
  Get,
  Query,
  Redirect,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ConfirmUserEmailInput } from './dto/confirm-user-email-input.dto';

import { UserExtraService } from './services/user-extra.service';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('users')
export class UserController {
  constructor(private readonly userExtraService: UserExtraService) {}

  @Redirect('https://nestjs.com', 302)
  @Get('/confirm-email')
  confirmEmail(@Query() input: ConfirmUserEmailInput): Promise<any> {
    return this.userExtraService.confirmEmail(input);
  }
}
