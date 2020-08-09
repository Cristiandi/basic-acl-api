import Fastify from 'fastify'

// order to register / load
// 1. plugins (from the Fastify ecosystem)
// 2. your plugins (your custom plugins)
// 3. decorators
// 4. hooks and middlewares
// 5. your services

export const build = async () => {
  const server = Fastify({
    bodyLimit: 1048576 * 2,
    logger: true
  });

  server.get('/', async (request, reply) => {
    reply.status(200).send(`${new Date()}`);
   })

   return server;
}

