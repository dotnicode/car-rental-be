import { randomUUID } from 'crypto';
import { envs } from 'src/config/envs';

import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';

import { FileType } from 'src/common/enums/file-type.enum';
import { FileValidatorService } from './file-validator.service';
import IFileUploadResult from './interfaces/file-upload-result.interface';
import IStorageService from './interfaces/storage-service.interface';
import { S3ConfigProvider } from './providers/s3.provider';

@Injectable()
export class AWSS3StorageService implements IStorageService {
  constructor(
    private readonly s3Provider: S3ConfigProvider,
    private readonly fileValidatorService: FileValidatorService,
  ) {}

  /**
   * Uploads a file to AWS S3
   *
   * @param file - The file to upload
   * @param fileType - The type of file to validate, it can be DOCUMENT(PDF, DOCX) or PICTURE(JPEG, PNG)
   * @returns {Promise<IFileUploadResult>} Object containing the file key (fileKey) and its public URL (fileUrl)
   * @throws {BadRequestException} If the file type is not allowed
   * @throws {Error} If the file upload fails
   */
  async uploadFile(file: Express.Multer.File, fileType: FileType): Promise<IFileUploadResult> {
    this.fileValidatorService.validateFile(file, fileType);

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

  /**
   * Deletes a file from AWS S3
   *
   * @param key - The key of the file to delete
   * @throws {Error} If the file deletion fails
   */
  async deleteFile(key: string): Promise<void> {
    await this.s3Provider.client.send(
      new DeleteObjectCommand({
        Bucket: this.s3Provider.bucketName,
        Key: key,
      }),
    );
  }
}
