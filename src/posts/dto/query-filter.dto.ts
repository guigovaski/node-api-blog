import { IsOptional, IsString } from 'class-validator';

export class QueryFilterDto {
    @IsString()
    @IsOptional()
    takeposts?: string;

    @IsString()
    @IsOptional()
    skipposts?: string;
}
