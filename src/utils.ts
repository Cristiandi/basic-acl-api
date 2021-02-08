import { nanoid } from 'nanoid';

export const generateUuid = (size: number): string => nanoid(size);

export const isEmptyObject = (obj = {}): boolean => {
  return !Object.keys(obj || {}).length;
};

export const addDaysToDate = (date: Date, days: number): Date => {
  const copy = new Date(Number(date));
  copy.setDate(date.getDate() + days);
  return copy;
};