import { IsString, IsUUID } from 'class-validator';

export class CreateRoleInput {
    @IsUUID()
    readonly companyUuid;
    
    @IsString()
    readonly name: string;

    @IsString()
    readonly code: string;
}