import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoleInput {
    @ApiProperty()
    @IsString()
    readonly companyUuid;
    
    @ApiProperty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    @IsString()
    readonly code: string;
}