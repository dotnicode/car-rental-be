import { randomUUID } from 'crypto';
import { envs } from 'src/config/envs';

import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

import IFileUploadResult from './interfaces/file-upload-result.interface';
import IStorageService from './interfaces/storage-service.interface';
import { S3ConfigProvider } from './providers/s3.provider';

@Injectable()
export class S3StorageService implements IStorageService {
  constructor(private readonly s3Provider: S3ConfigProvider) {}

  async uploadFile(file: Express.Multer.File): Promise<IFileUploadResult> {
    const fileKey = randomUUID();

    try {
      await this.s3Provider.client.send(
        new PutObjectCommand({
          Bucket: this.s3Provider.bucketName,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      return {
        fileKey,
        fileUrl: `${envs.AWS_ENDPOINT}/${this.s3Provider.bucketName}/${fileKey}`,
      };
    } catch (error) {
      throw new Error('Upload failed');
    }
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3Provider.client.send(
      new DeleteObjectCommand({
        Bucket: this.s3Provider.bucketName,
        Key: key,
      }),
    );
  }
}
