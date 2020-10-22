import { Controller, Get, Query, UsePipes, ValidationPipe, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { CompaniesService } from './companies.service';

import { Public } from '../../common/decorators/public.decorator';

import { CreateCompanyInput } from './dto/create-company-input.dto';
import { FindAllCompaniesInput } from './dto/find-all-companies-input.dto';
import { FindOneCompanyInput } from './dto/find-one-company-input.dto';
import { UpdateCompanyInput } from './dto/update-company-input.dto';
import { GetYourCompanyInput } from './dto/get-your-company-input.dto';

import { Company } from './company.entity';

@ApiTags('companies')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @ApiResponse({
    status: 200,
    description: 'the created item.',
    type: Company
  })
  @Public()
  @Post()
  create(@Body() createCompanyInput: CreateCompanyInput): Promise<Company> {
    return this.companiesService.create(createCompanyInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the items.',
    type: [Company]
  })
  @Get()
  findAll(@Query() findAllCompaniesInput: FindAllCompaniesInput): Promise<Company[]> {
    return this.companiesService.findAll(findAllCompaniesInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the item.',
    type: Company
  })
  @Get(':id')
  findOne(@Param() findOneCompanyInput: FindOneCompanyInput ): Promise<Company> {
    return this.companiesService.findOne(findOneCompanyInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the updated item.',
    type: Company
  })
  @Patch(':id')
  update(
    @Param() findOneCompanyInput: FindOneCompanyInput,
    @Body() updateCompanyInput: UpdateCompanyInput
  ) : Promise<Company> {
    return this.companiesService.update(findOneCompanyInput, updateCompanyInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the removed item.',
    type: Company
  })
  @Delete(':id')
  remove(@Param() findOneCompanyInput: FindOneCompanyInput): Promise<Company> {
    return this.companiesService.remove(findOneCompanyInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the item.',
    type: Company
  })
  @Get('/your-company/:uuid')
  getYourCompany(@Param() getYourCompanyInput: GetYourCompanyInput): Promise<Company> {
    return this.companiesService.getYourCompany(getYourCompanyInput);
  }
}
