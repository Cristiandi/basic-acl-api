import { v4 as uuidv4 } from 'uuid';

export const generateUuid = (): string => uuidv4();

export const isEmptyObject = (obj = {}): boolean => {
  return !Object.keys(obj || {}).length;
};

export const addDaysToDate = (date: Date, days: number): Date => {
  const copy = new Date(Number(date));
  copy.setDate(date.getDate() + days);
  return copy;
};