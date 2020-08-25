import { Controller, Get, Query, UsePipes, ValidationPipe, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';

import { Public } from 'src/common/decorators/public.decorator';

import { CreateCompanyInput } from './dto/create-company-input.dto';
import { FindAllCompaniesInput } from './dto/find-all-companies-input.dto';
import { FindOneCompanyInput } from './dto/find-one-company-input.dto';
import { UpdateCompanyInput } from './dto/update-company-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Public()
  @Post()
  create(@Body() createCompanyInput: CreateCompanyInput): Promise<any> {
    return this.companiesService.create(createCompanyInput);
  }

  @Get()
  findAll(@Query() findAllCompaniesInput: FindAllCompaniesInput): Promise<any> {
    return this.companiesService.findAll(findAllCompaniesInput);
  }

  @Get(':id')
  findOne(@Param() findOneCompanyInput: FindOneCompanyInput ): Promise<any> {
    return this.companiesService.findOne(findOneCompanyInput);
  }

  @Patch(':id')
  update(@Param() findOneCompanyInput: FindOneCompanyInput, @Body() updateCompanyInput: UpdateCompanyInput) : Promise<any> {
    return this.companiesService.update(findOneCompanyInput, updateCompanyInput);
  }

  @Delete(':id')
  remove(@Param() findOneCompanyInput: FindOneCompanyInput): Promise<any> {
    return this.companiesService.remove(findOneCompanyInput);
  }
}
