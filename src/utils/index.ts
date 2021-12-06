import { nanoid } from 'nanoid';

export const generateUid = (size: number) => nanoid(size);

export const addDaysToDate = (date: Date, days: number): Date => {
  const copy = new Date(Number(date));
  copy.setDate(date.getDate() + days);
  return copy;
};

export const streamToString = (
  stream: NodeJS.ReadableStream,
): Promise<string> => {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
};
