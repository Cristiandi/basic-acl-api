import { IsUUID } from 'class-validator';
import { FindOneInput as FindOneInputCommon } from '../../../common/dto/find-one-input.dto';

export class FindOneInput extends FindOneInputCommon {
  @IsUUID()
  readonly companyUuid: string;
}