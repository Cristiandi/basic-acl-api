import * as path from 'path';
import * as request from 'supertest';
import * as faker from 'faker';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesModule } from '../../src/modules/companies/companies.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import appConfig from '../../src/config/app.config';
import appConfigSchema from '../../src/config/app.config.schema';

import { CommonModule } from '../../src/common/common.module';

import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { CreateCompanyInput } from 'src/modules/companies/dto/create-company-input.dto';

const NODE_ENV = process.env.NODE_ENV || 'local';
const envPath = path.resolve(__dirname, `../../.env.${NODE_ENV}`);

describe('[Feature] Companies - /companies', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: envPath,
          load: [appConfig],
          validationSchema: appConfigSchema
        }),
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: +process.env.DATABASE_PORT,
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            autoLoadEntities: true,
            synchronize: process.env.NODE_ENV !== 'production'
          })
        }),
        CommonModule,
        CompaniesModule
      ]
    }).compile();

    app = moduleFixture.createNestApplication();

    // using the filters
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  it('Create [POST /]', () => {
    const input: CreateCompanyInput = {
      countryCode: 'CO',
      name: faker.company.companyName(),
      uuid: faker.random.uuid(),
      serviceAccount: {
        auth_provider_x509_cert_url: faker.random.alphaNumeric(),
        auth_uri: faker.random.alphaNumeric(),
        client_email: faker.internet.email(),
        client_id: faker.random.alphaNumeric(),
        client_x509_cert_url: faker.random.alphaNumeric(),
        private_key: faker.random.alphaNumeric(),
        private_key_id: faker.random.alphaNumeric(),
        project_id: faker.random.alphaNumeric(),
        token_uri: faker.random.alphaNumeric(),
        type: faker.random.alphaNumeric()
      }
    };

    return request(app.getHttpServer())
      .post('/companies')
      .send(input)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body).toHaveProperty('id');
      });
  });
  it.todo('Get all [GET /]');
  it.todo('Get one [GET /:id]');
  it.todo('Update one [PATCH /:id]');
  it.todo('Delete one [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  });
});