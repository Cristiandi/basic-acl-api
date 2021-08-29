import { nanoid } from 'nanoid';

export const generateUid = (size: number) => nanoid(size);

export const addDaysToDate = (date: Date, days: number): Date => {
  const copy = new Date(Number(date));
  copy.setDate(date.getDate() + days);
  return copy;
};
