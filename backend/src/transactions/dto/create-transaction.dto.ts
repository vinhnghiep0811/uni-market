import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateTransactionDto {
    @IsUUID()
    listingId: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    message?: string;
}