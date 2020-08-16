import { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'
import { CompanyService } from './company.service'

import { CreateCompanyDto } from './dtos/create-company.dto'
import { FindOneCompanyDto } from './dtos/find-one-company.dto'
import { FindAllCompaniesDto } from './dtos/find-all.companies'
import { updateCompanyDto } from './dtos/update-company-dto'

const companyService = container.resolve(CompanyService)

export default async (server: FastifyInstance): Promise<void> => {
  server.post<{
    Body: CreateCompanyDto
  }>('/',
    {
      preValidation: [server.validatePayloadPlugin('body', CreateCompanyDto)]
    },
    async (request, reply) => {
      const result = await companyService.create(request.body)

      return reply.status(201).send(result)
    }
  )

  server.get<{
    Querystring: FindAllCompaniesDto
  }>('/',
    {
      preValidation: [server.validatePayloadPlugin('query', FindAllCompaniesDto)]
    },
    async (request, reply) => {
      const result = await companyService.findAll(request.query)

      return reply.status(201).send(result)
    }
  )

  server.get<{
    Params: FindOneCompanyDto
  }>('/:id',
    {
      preValidation: [server.validatePayloadPlugin('params', FindOneCompanyDto)]
    },
    async (request, reply) => {
      const result = await companyService.findOne(request.params)

      return reply.status(201).send(result)
    }
  )

  server.patch<{
    Params: FindOneCompanyDto
    Body: typeof updateCompanyDto
  }>(
    '/:id',
    {
      preValidation: [
        server.validatePayloadPlugin('params', FindOneCompanyDto),
        server.validatePayloadPlugin('body', updateCompanyDto)
      ]
    },
    async (request, reply) => {
      const result = await companyService.update(request.params, request.body)

      return reply.status(200).send(result)
    }
  )

  server.delete<{
    Params: FindOneCompanyDto
  }>(
    '/:id',
    {
      preValidation: [
        server.validatePayloadPlugin('params', FindOneCompanyDto)
      ]
    },
    async (request, reply) => {
      const result = await companyService.remove(request.params)

      return reply.status(200).send(result)
    }
  )
}
