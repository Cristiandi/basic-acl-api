import { NotFoundException, HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from './company.entity';

import { CompaniesService } from './companies.service';
import { CreateCompanyInput } from './dto/create-company-input.dto';
import { UpdateCompanyInput } from './dto/update-company-input.dto';
import { match } from 'assert';

// function to mock the repositry
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
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

  describe('findAll', () => {
    describe('when has results', () => {
      it('should return a companies array', async () => {
        const expectedResult = [{}];

        companyRepository.find.mockReturnValue(expectedResult);

        const companies = await service.findAll({ limit: 1, offset: 1 });

        expect(companies).toEqual(expectedResult);
      });
    });

    describe('when does not have results', () => {
      it('should return an empty array', async () => {
        const expectedResult = [];

        companyRepository.find.mockReturnValue(expectedResult);

        const companies = await service.findAll({ limit: 1, offset: 1 });

        expect(companies).toEqual(expectedResult);
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

  describe('update', () => {
    describe('when update a company', () => {
      it('should return a company object', async () => {
        const expectedResult = {};

        companyRepository.preload.mockReturnValueOnce({});
        companyRepository.find.mockReturnValueOnce([]);
        companyRepository.save.mockReturnValueOnce({});

        const company = await service.update({ id: '1' }, {} as UpdateCompanyInput);

        expect(company).toEqual(expectedResult);
      });
    });

    describe('when other company already using unique values', () => {
      it('should throw the ""HttpException', async () => {
        companyRepository.preload.mockReturnValueOnce({id: 1});
        companyRepository.find.mockReturnValueOnce([{id: 1}]);
        
        try {
          await service.update({ id: '1' }, {} as UpdateCompanyInput);
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
        }
      });
    });
  });

  describe('remove', () => {
    describe('when remove a company', () => {
      it('should return a company object', async () => {
        const expectedResult = {};

        companyRepository.findOne.mockReturnValueOnce({});
        companyRepository.remove.mockReturnValue({});

        const company = await service.remove({ id: '1' });

        expect(company).toEqual(expectedResult);
      });
    });

    describe('when the company does not exists', () => {
      it('should throw the "NotFoundException"', async () => {
        companyRepository.findOne.mockReturnValueOnce(undefined);

        try {
          await service.remove({ id: '1' });
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });

  describe('getServiceAccount', () => {
    describe('when company exists', () => {
      it('should return service account', async () => {
        const expectedResult = '';

        companyRepository.find.mockReturnValueOnce([{serviceAccount: expectedResult}]);

        const serviceAccount = await service.getServiceAccount({ uuid: 'uuid' });

        expect(serviceAccount).toEqual(expectedResult);
      });
    });
    
    describe('when compnay does not exists', () => {
      it('should throw the "NotFoundException"', async () => {
        companyRepository.find.mockReturnValueOnce([]);

        try {
          await service.getServiceAccount({ uuid: 'uuid' });
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });
});
