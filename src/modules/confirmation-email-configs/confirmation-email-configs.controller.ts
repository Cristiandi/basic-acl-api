import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ConfirmationEmailConfig } from './confirmation-email-config.entity';

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

  @ApiResponse({
    status: 200,
    description: 'the created item.',
    type: ConfirmationEmailConfig
  })
  @Post()
  create (@Body() createConfirmationEmailCionfig: CreateConfirmationEmailCionfig): Promise<ConfirmationEmailConfig> {
    return this.confirmationEmailConfigsService.create(createConfirmationEmailCionfig);
  }

  @ApiResponse({
    status: 200,
    description: 'the item.',
    type: ConfirmationEmailConfig
  })
  @Get(':companyUuid')
  findAll(
    @Param() findAllConfirmationEmailConfigsParamInput: FindAllConfirmationEmailConfigsParamInput,
    @Query() findAllConfirmationEmailConfigsQueryInput: FindAllConfirmationEmailConfigsQueryInput
  ): Promise<ConfirmationEmailConfig[]> {
    return this.confirmationEmailConfigsService.findAll(
      findAllConfirmationEmailConfigsParamInput,
      findAllConfirmationEmailConfigsQueryInput
    );
  }

  @ApiResponse({
    status: 200,
    description: 'the item.',
    type: ConfirmationEmailConfig
  })
  @Patch(':companyUuid/:id')
  update(
    @Param() findOneConfirmationEmailConfigInput: FindOneConfirmationEmailConfigInput,
    @Body() updateConfirmationEmailConfigInput: UpdateConfirmationEmailConfigInput
  ): Promise<ConfirmationEmailConfig> {
    return this.confirmationEmailConfigsService.update(findOneConfirmationEmailConfigInput, updateConfirmationEmailConfigInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the item.',
    type: ConfirmationEmailConfig
  })
  @Delete(':companyUuid/:id')
  remove(@Param() findOneConfirmationEmailConfigInput: FindOneConfirmationEmailConfigInput): Promise<ConfirmationEmailConfig> {
    return this.confirmationEmailConfigsService.remove(findOneConfirmationEmailConfigInput);
  }
}
