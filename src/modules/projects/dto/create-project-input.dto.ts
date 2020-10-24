import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateProjectInput {
    @ApiProperty()
    @IsUUID()
    readonly companyUuid: string;
    
    @ApiProperty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    @IsString()
    readonly code: string;
}