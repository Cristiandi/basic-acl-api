import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProjectInput {
    @ApiProperty()
    @IsString()
    readonly companyUuid: string;
    
    @ApiProperty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    @IsString()
    readonly code: string;
}