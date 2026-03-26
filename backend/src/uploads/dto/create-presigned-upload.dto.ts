import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreatePresignedUploadDto {
    @IsString()
    @IsNotEmpty()
    filename: string;

    @IsString()
    @IsIn(['image/jpeg', 'image/png', 'image/webp'])
    contentType: string;
}