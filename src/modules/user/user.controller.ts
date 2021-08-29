import {
  Controller,
  Get,
  Query,
  Redirect,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UserExtraService } from './services/user-extra.service';

import { Public } from '../../common/decorators/public.decorator';

import { ConfirmUserEmailInput } from './dto/confirm-user-email-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('users')
export class UserController {
  constructor(private readonly userExtraService: UserExtraService) {}

  @Public()
  @Redirect('https://nestjs.com', 302)
  @Get('/confirm-email')
  confirmEmail(@Query() input: ConfirmUserEmailInput): Promise<any> {
    return this.userExtraService.confirmEmail(input);
  }
}
