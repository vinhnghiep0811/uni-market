import { IsOptional, IsString, MinLength, MaxLength, IsUrl } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    fullName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    phoneNumber?: string;

    @IsOptional()
    @IsUrl()
    @MaxLength(255)
    facebookLink?: string;

    @IsOptional()
    @IsUrl()
    @MaxLength(500)
    avatarUrl?: string;
}