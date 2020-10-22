import { IsString, IsUUID } from 'class-validator';

export class CreateProjectInput {
    @IsUUID()
    readonly companyUuid;
    
    @IsString()
    readonly name: string;

    @IsString()
    readonly code: string;
}