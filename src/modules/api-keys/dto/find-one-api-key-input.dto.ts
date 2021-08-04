import { IsString } from 'class-validator';
import { FindOneInput } from '../../../common/dto/find-one-input.dto';

export class FindOneApiKeyInput extends FindOneInput {
    @IsString()
    readonly companyUuid: string;
}
