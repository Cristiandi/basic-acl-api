import { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'
import { CompanyService } from './company.service'

import { CreateCompanyDto } from './dtos/create-company.dto'

const companyService = container.resolve(CompanyService)

export default async (server: FastifyInstance): Promise<void> => {
  server.post<{
    Body: CreateCompanyDto
  }>('/',
    { preValidation: [server.validatePayloadPlugin('body', CreateCompanyDto)] },
    async (request, reply) => {
      const result = await companyService.create(request.body)

      return reply.status(201).send(result)
    })
}
