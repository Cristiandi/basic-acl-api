import { build } from './app'

const { APP_PORT } = { APP_PORT: 8080 }

build().then(server => {
  server.listen(APP_PORT, (err, address) => {
    if(err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`server listening at ${address}`)
  })
})