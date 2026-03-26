import {
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { randomUUID } from 'crypto';
import * as path from 'path';

@Injectable()
export class UploadsService {
    private readonly minioClient: Client;
    private readonly bucket: string;
    private readonly publicUrl: string;

    constructor(private readonly configService: ConfigService) {
        const endPoint = this.configService.get<string>('MINIO_ENDPOINT');
        const port = Number(this.configService.get<string>('MINIO_PORT'));
        const useSSL =
            this.configService.get<string>('MINIO_USE_SSL') === 'true';
        const accessKey = this.configService.get<string>('MINIO_ACCESS_KEY');
        const secretKey = this.configService.get<string>('MINIO_SECRET_KEY');

        this.bucket = this.configService.get<string>('MINIO_BUCKET')!;
        this.publicUrl = this.configService.get<string>('MINIO_PUBLIC_URL')!;

        if (!endPoint || !port || !accessKey || !secretKey || !this.bucket) {
            throw new Error('MinIO env is missing');
        }

        this.minioClient = new Client({
            endPoint,
            port,
            useSSL,
            accessKey,
            secretKey,
        });
    }

    async uploadListingImage(input: {
        userId: string;
        filename: string;
        contentType: string;
        buffer: Buffer;
    }) {
        const ext = path.extname(input.filename) || '';
        const objectName = `listings/${input.userId}/${randomUUID()}${ext}`;

        try {
            await this.minioClient.putObject(
                this.bucket,
                objectName,
                input.buffer,
                input.buffer.length,
                {
                    'Content-Type': input.contentType,
                },
            );

            return {
                key: objectName,
                publicUrl: `${this.publicUrl}/${this.bucket}/${objectName}`,
            };
        } catch (error) {
            console.error('MINIO UPLOAD ERROR:', error);
            throw new InternalServerErrorException(
                error instanceof Error ? error.message : 'Could not upload file',
            );
        }
    }
}