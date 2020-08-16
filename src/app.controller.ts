import { FastifyInstance, RegisterOptions } from 'fastify'

import companyController from './modules/companies/company.controller'

export default async (server: FastifyInstance, options: RegisterOptions): Promise<void> => {
  server.get('/', async (request, reply) => {
    reply.status(200).send(`${new Date()}`)
  })
  server.register(companyController, { prefix: 'companies' })
}
