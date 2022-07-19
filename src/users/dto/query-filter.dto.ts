import { IsOptional, IsString } from 'class-validator';

export class QueryFilterDto {
    @IsString()
    @IsOptional()
    takeusers?: string;

    @IsString()
    @IsOptional()
    skipusers?: string;

    @IsString()
    @IsOptional()
    takeposts?: string;

    @IsString()
    @IsOptional()
    skipposts?: string;
}
