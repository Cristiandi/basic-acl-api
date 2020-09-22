import * as path from 'path';
import * as request from 'supertest';
import * as faker from 'faker';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesModule } from '../../src/modules/companies/companies.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import appConfigSchema from '../../src/config/app.config.schema';

import { CommonModule } from '../../src/common/common.module';

import { CustomExceptionFilter } from '../../src/common/filters/cutstom-exception.filter';
import { CreateCompanyInput } from '../../src/modules/companies/dto/create-company-input.dto';
import { UpdateCompanyInput } from '../../src/modules/companies/dto/update-company-input.dto';

const NODE_ENV = process.env.NODE_ENV || 'local';
const envPath = path.resolve(__dirname, `../../.env.${NODE_ENV}`);

describe('[Feature] Companies - /companies', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: envPath,
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
    app.useGlobalFilters(new CustomExceptionFilter());

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
  it('Get all [GET /]', () => {
    return request(app.getHttpServer())
      .get('/companies')
      .set('Authorization', process.env.API_KEY)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBeTruthy();
        expect(body.length).toBeGreaterThan(0);
      });
  });
  it('Get one [GET /:id]', () => {
    const id = 1;

    return request(app.getHttpServer())
      .get(`/companies/${id}`)
      .set('Authorization', process.env.API_KEY)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toHaveProperty('id', id);
      });
  });
  it('Update one [PATCH /:id]', () => {
    const id = 1;
    const input: UpdateCompanyInput = {
      name: 'updated'
    };

    return request(app.getHttpServer())
      .patch(`/companies/${id}`)
      .send(input)
      .set('Authorization', process.env.API_KEY)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toHaveProperty('name', input.name);
      });
  });
  it('Delete one [DELETE /:id]', () => {
    const id = 1;

    return request(app.getHttpServer())
      .delete(`/companies/${id}`)
      .set('Authorization', process.env.API_KEY)
      .expect(HttpStatus.OK);
  });

  afterAll(async () => {
    await app.close();
  });
});