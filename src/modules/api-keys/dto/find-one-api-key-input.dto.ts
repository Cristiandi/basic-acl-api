import { IsUUID } from 'class-validator';
import { FindOneInput } from '../../../common/dto/find-one-input.dto';

export class FindOneApiKeyInput extends FindOneInput {
    @IsUUID()
    readonly companyUuid: string;
}
