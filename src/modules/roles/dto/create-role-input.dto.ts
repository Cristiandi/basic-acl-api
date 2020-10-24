import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateRoleInput {
    @ApiProperty()
    @IsUUID()
    readonly companyUuid;
    
    @ApiProperty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    @IsString()
    readonly code: string;
}