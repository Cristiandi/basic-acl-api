import { IsNumberString } from 'class-validator';

export class FindOneInput {
  @IsNumberString()
  id: string;
}
