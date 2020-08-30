import { NotFoundException, HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from './company.entity';

import { CompaniesService } from './companies.service';
import { CreateCompanyInput } from './dto/create-company-input.dto';

// function to mock the repositry
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn()
});

describe('CompanyService', () => {
  let service: CompaniesService;
  let companyRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getRepositoryToken(Company),
          useValue: createMockRepository()
        }
      ]
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);

    companyRepository = module.get<MockRepository>(getRepositoryToken(Company));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    describe('when create a company', () => {
      it('should return the company object', async () => {
        const expectedCompany = {} as CreateCompanyInput;

        companyRepository.find.mockReturnValue([]);
        companyRepository.create.mockReturnValue(expectedCompany);
        companyRepository.save.mockResolvedValue(expectedCompany);

        const company = await service.create(expectedCompany);

        expect(company).toEqual(expectedCompany);
      });
    });

    describe('when a company already exists', () => {
      it('should throw the "HttpException"', async () => {
        const createCompanyInput = {} as CreateCompanyInput;

        companyRepository.find.mockReturnValue([{}]);

        try {
          await service.create(createCompanyInput);
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
        }
      });
    });
  });

  describe('findOne', () => {
    describe('when a company exists', () => {
      it('should return the company object', async () => {
        const expectedCompany = {};

        companyRepository.findOne.mockReturnValue(expectedCompany);

        const company = await service.findOne({ id: '1' });

        expect(company).toEqual(expectedCompany);
      });
    });

    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        companyRepository.findOne.mockReturnValue(null);

        try {
          await service.findOne({ id: '1' });
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });
});
