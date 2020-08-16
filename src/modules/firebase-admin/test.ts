import 'reflect-metadata'

import { container } from 'tsyringe'

import { FirebaseAdminService } from './firebase-admin.service'

(async () => {
  const uuid = '9dd6241d-2fa7-4301-a3dc-ff7bcecd12ec'

  const firebaseAdminService = container.resolve(FirebaseAdminService)

  const userRecord = await firebaseAdminService.createUser(uuid, 'divelo2.test@gmail.com', '123456', '6667778889', 'MX')

  console.log(userRecord)
})()
  .catch(err => console.error(err))
  .finally(() => process.exit(0))
