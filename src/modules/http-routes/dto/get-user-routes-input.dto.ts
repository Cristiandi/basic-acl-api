import { IsInt } from 'class-validator';

export class GetUserRoutesInput {
  @IsInt()
  userId: number;
}