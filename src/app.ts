import 'reflect-metadata'

import Fastify, { FastifyInstance } from 'fastify'

// my plugins
import validatePayloadPlugin from './plugins/validate-payload.plugin'

// services
import appController from './app.controller'

// order to register / load
// 1. plugins (from the Fastify ecosystem)
// 2. your plugins (your custom plugins)
// 3. decorators
// 4. hooks and middlewares
// 5. your services

export const build = async (): Promise<FastifyInstance> => {
  const server = Fastify({
    bodyLimit: 1048576 * 2,
    logger: true
  })

  // my plugins
  server.register(validatePayloadPlugin)

  // services
  server.register(appController)

  return server
}
