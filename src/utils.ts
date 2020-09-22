import { v4 as uuidv4 } from 'uuid';

export const generateUuid = (): string => uuidv4();

export const isEmptyObject = (obj = {}) => {
  return !Object.keys(obj || {}).length;
};