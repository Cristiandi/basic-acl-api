import { nanoid } from 'nanoid';

export const generateUid = (size: number) => nanoid(size);
