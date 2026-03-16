import { IsEnum } from 'class-validator';
import { ListingStatus } from '../../../generated/prisma/client';

export class UpdateListingStatusDto {
    @IsEnum(ListingStatus)
    status: ListingStatus;
}