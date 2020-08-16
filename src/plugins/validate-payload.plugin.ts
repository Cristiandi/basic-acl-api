import {
  FastifyRequest,
  FastifyReply,
  HookHandlerDoneFunction,
  preValidationHookHandler,
  FastifyPlugin
} from 'fastify'
import fp from 'fastify-plugin'
import { plainToClass } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { iterate } from 'iterare'
import { throwError } from '../utils'

const prependConstraintsWithParentProp = (
  parentError: ValidationError,
  error: ValidationError
): ValidationError => {
  const constraints:any = {}
  for (const key in error.constraints) {
    constraints[key] = `${parentError.property}.${error.constraints[key]}`
  }
  return {
    ...error,
    constraints
  }
}

const mapChildrenToValidationErrors = (
  error: ValidationError
): ValidationError[] => {
  if (!(error.children && error.children.length)) {
    return [error]
  }
  const validationErrors = []
  for (const item of error.children) {
    if (item.children && item.children.length) {
      validationErrors.push(...mapChildrenToValidationErrors(item))
    }
    validationErrors.push(prependConstraintsWithParentProp(error, item))
  }
  return validationErrors
}

const flattenValidationErrors = (
  validationErrors: ValidationError[]
): string[] => {
  return iterate(validationErrors)
    .map((error: any) => mapChildrenToValidationErrors(error))
    .flatten()
    .filter((item: any) => !!item.constraints)
    .map((item: any) => Object.values(item.constraints))
    .flatten()
    .toArray()
    .map(item => String(item))
}

const handleErrors = (errors: ValidationError[]): string => {
  const result = flattenValidationErrors(errors)

  return result.join(' | ')
}

const validatePayload: (property: string, metatype: any) => preValidationHookHandler = function (property: string, metatype: any): preValidationHookHandler {
  return async (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    const dirtyRequest: any = { ...request }

    const value = dirtyRequest[property]

    const object = plainToClass(metatype, value)

    const errors = await validate(object, {
      skipMissingProperties: false,
      validationError: { target: true },
      whitelist: true,
      forbidNonWhitelisted: true
    })

    if (errors.length) {
      const message = handleErrors(errors)
      throw throwError(400, message)
    }
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    validatePayloadPlugin: (property: string, metatype: any) => preValidationHookHandler
  }
}

// define plugin
const validatePayloadPlugin: FastifyPlugin = (fastify, options, done) => {
  fastify.decorate('validatePayloadPlugin', validatePayload)
  done()
}

export default fp(validatePayloadPlugin, '3.x')
