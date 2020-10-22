import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ConfirmationEmailConfigsService } from './confirmation-email-configs.service';

import { CreateConfirmationEmailCionfig } from './dto/create-confirmation-email-config-input.dto';
import { FindAllConfirmationEmailConfigsParamInput } from './dto/find-all-confirmation-email-configs-param-input.dto';
import { FindAllConfirmationEmailConfigsQueryInput } from './dto/find-all-confirmation-email-configs-query-input.dto';
import { FindOneConfirmationEmailConfigInput } from './dto/find-one-confirmation-email-config-input.dto';
import { UpdateConfirmationEmailConfigInput } from './dto/update-confirmation-email-config-input.dto';

@ApiTags('confirmation-email-configs')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('confirmation-email-configs')
export class ConfirmationEmailConfigsController {
  constructor(private readonly confirmationEmailConfigsService: ConfirmationEmailConfigsService) {}

  @Post()
  create (@Body() createConfirmationEmailCionfig: CreateConfirmationEmailCionfig): Promise<any> {
    return this.confirmationEmailConfigsService.create(createConfirmationEmailCionfig);
  }

  @Get(':companyUuid')
  findAll(
    @Param() findAllConfirmationEmailConfigsParamInput: FindAllConfirmationEmailConfigsParamInput,
    @Query() findAllConfirmationEmailConfigsQueryInput: FindAllConfirmationEmailConfigsQueryInput
  ): Promise<any> {
    return this.confirmationEmailConfigsService.findAll(
      findAllConfirmationEmailConfigsParamInput,
      findAllConfirmationEmailConfigsQueryInput
    );
  }

  @Patch(':companyUuid/:id')
  update(
    @Param() findOneConfirmationEmailConfigInput: FindOneConfirmationEmailConfigInput,
    @Body() updateConfirmationEmailConfigInput: UpdateConfirmationEmailConfigInput
  ): Promise<any> {
    return this.confirmationEmailConfigsService.update(findOneConfirmationEmailConfigInput, updateConfirmationEmailConfigInput);
  }

  @Delete(':companyUuid/:id')
  remove(@Param() findOneConfirmationEmailConfigInput: FindOneConfirmationEmailConfigInput): Promise<any> {
    return this.confirmationEmailConfigsService.remove(findOneConfirmationEmailConfigInput);
  }
}
