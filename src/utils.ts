import { v4 as uuidv4 } from 'uuid'

class HttpException extends Error {
  status: number;
  message: string;
  constructor (status: number, message: string) {
    super(message)
    this.status = status
    this.message = message
  }
}

export const throwError = (statusCode = 500, message: string): HttpException => {
  const err = new HttpException(statusCode, message)
  return err
}

export const ksort = (obj: any): any => {
  const keys = Object.keys(obj).sort()
  const sortedObj: any = {}

  for (const i in keys) {
    sortedObj[keys[i]] = obj[keys[i]]
  }

  return sortedObj
}

export const buildQueryHttpParams = (obj: any): URLSearchParams => {
  const searchParameters = new URLSearchParams()

  Object.keys(obj).forEach(parameterName => {
    searchParameters.append(parameterName, obj[parameterName])
  })

  return searchParameters
}

export const isEmptyObject = (obj = {}): boolean => {
  return !Object.keys(obj).length
}

export const charIsDigit = (c: string) => /^\d$/.test(c)

export const stringIsDigit = (c: string) => /(\d+)/.test(c)

export const digitNumberWordsToFind = (wordArray: string[]) => {
  const rg = new RegExp(/(\d+)/)

  return wordArray.filter(item => {
    if (rg.test(item)) {
      return item
    }
  })
}

export const getKeyValue = (key: string) => (obj: Record<string, any>) => obj[key]

export const generateUuid = (): string => uuidv4()
