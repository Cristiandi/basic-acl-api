import { build } from './app'

import environment from './environment'

build().then(server => {
  server.listen(environment.APP_PORT, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`server listening at ${address} | on ${environment.NODE_ENV}!`)
  })
})
