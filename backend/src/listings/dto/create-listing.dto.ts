import {
    IsArray,
    IsEnum,
    IsOptional,
    IsString,
    IsUUID,
    Length,
    MaxLength,
    ArrayMaxSize,
    IsNumberString,
    IsUrl,
} from 'class-validator';
import { ListingCondition } from '../../../generated/prisma/client';

export class CreateListingDto {
    @IsString()
    @Length(5, 150)
    title: string;

    @IsString()
    @Length(10, 5000)
    description: string;

    @IsNumberString()
    price: string;

    @IsEnum(ListingCondition)
    condition: ListingCondition;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    location?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    contactNote?: string;

    @IsUUID()
    categoryId: string;

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(10)
    @IsUrl({ require_tld: false }, { each: true })
    imageUrls?: string[];
}