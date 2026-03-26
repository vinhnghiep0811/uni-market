import {
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) { }

    @UseGuards(JwtAuthGuard)
    @Post('image')
    @UseInterceptors(
        FileInterceptor('file', {
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
            fileFilter: (_req, file, cb) => {
                const allowed = ['image/jpeg', 'image/png', 'image/webp'];
                if (!allowed.includes(file.mimetype)) {
                    return cb(
                        new BadRequestException('Only jpg, png, webp are allowed'),
                        false,
                    );
                }
                cb(null, true);
            },
        }),
    )
    async uploadImage(
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() user: any,
    ) {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        return this.uploadsService.uploadListingImage({
            userId: user.id,
            filename: file.originalname,
            contentType: file.mimetype,
            buffer: file.buffer,
        });
    }
}