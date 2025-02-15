import { randomUUID } from 'crypto';
import { FileType } from 'src/common/enums/file-type.enum';
import { envs } from 'src/config/envs';

import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Test, TestingModule } from '@nestjs/testing';

import { AWSS3StorageService } from './aws-s3-storage.service';
import IFileUploadResult from './interfaces/file-upload-result.interface';
import { FileValidatorService } from './file-validator.service';
import { S3ConfigProvider } from './providers/s3.provider';
import { BadRequestException } from '@nestjs/common';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'mocked-uuid'),
}));

describe('AWSS3StorageService', () => {
  let service: AWSS3StorageService;
  let s3Provider: S3ConfigProvider;
  let fileValidatorService: FileValidatorService;

  const mockS3Provider = {
    client: {
      send: jest.fn(),
    },
    bucketName: envs.AWS_BUCKET_NAME,
  };

  const mockFileValidatorService = {
    validateFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AWSS3StorageService,
        {
          provide: S3ConfigProvider,
          useValue: mockS3Provider,
        },
        {
          provide: FileValidatorService,
          useValue: mockFileValidatorService,
        },
      ],
    }).compile();

    service = module.get<AWSS3StorageService>(AWSS3StorageService);
    s3Provider = module.get<S3ConfigProvider>(S3ConfigProvider);
    fileValidatorService = module.get<FileValidatorService>(FileValidatorService);
  });

  describe('uploadFile', () => {
    it('should upload a file and return fileKey and fileUrl', async () => {
      const mockFile: Express.Multer.File = {
        buffer: Buffer.from('test file content'),
        mimetype: 'image/png',
      } as Express.Multer.File;

      mockS3Provider.client.send.mockResolvedValue({});

      const result: IFileUploadResult = await service.uploadFile(mockFile, FileType.PICTURE);

      expect(mockFileValidatorService.validateFile).toHaveBeenCalledWith(
        mockFile,
        FileType.PICTURE,
      );
      expect(mockS3Provider.client.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
      expect(result).toEqual({
        fileKey: 'mocked-uuid',
        fileUrl: `${envs.AWS_ENDPOINT}/${envs.AWS_BUCKET_NAME}/mocked-uuid`,
      });
    });

    it('should throw BadRequestException when file type is not allowed', async () => {
      const mockFile: Express.Multer.File = {
        buffer: Buffer.from('test file content'),
        mimetype: 'image/gif',
      } as Express.Multer.File;

      mockFileValidatorService.validateFile.mockImplementation(() => {
        throw new BadRequestException('File type not allowed for picture');
      });

      await expect(service.uploadFile(mockFile, FileType.PICTURE)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('deleteFile', () => {
    it('should delete a file from S3', async () => {
      mockS3Provider.client.send.mockResolvedValue({});
      await service.deleteFile('mocked-uuid');
      expect(mockS3Provider.client.send).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));
    });

    it('should throw error when deletion fails', async () => {
      mockS3Provider.client.send.mockRejectedValue(new Error('Delete failed'));
      await expect(service.deleteFile('mocked-uuid')).rejects.toThrow('Delete failed');
    });
  });
});
