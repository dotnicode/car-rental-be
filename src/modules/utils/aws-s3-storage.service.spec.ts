import { randomUUID } from 'crypto';
import { envs } from 'src/config/envs';

import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Test, TestingModule } from '@nestjs/testing';

import IFileUploadResult from './interfaces/file-upload-result.interface';
import { S3StorageService } from './aws-s3-storage.service';

jest.mock('@aws-sdk/client-s3');
jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'mocked-uuid'),
}));

describe('S3StorageService', () => {
  let service: S3StorageService;
  let s3Client: S3Client;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3StorageService,
        {
          provide: S3Client,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<S3StorageService>(S3StorageService);
    s3Client = module.get<S3Client>(S3Client);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload a file and return fileKey and fileUrl', async () => {
      const mockFile: Express.Multer.File = {
        buffer: Buffer.from('test file content'),
        mimetype: 'image/png',
      } as Express.Multer.File;

      (s3Client.send as jest.Mock).mockResolvedValue({});

      const result: IFileUploadResult = await service.uploadFile(mockFile);

      expect(s3Client.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
      expect(result).toEqual({
        fileKey: 'mocked-uuid',
        fileUrl: `http://${envs.AWS_ENDPOINT}/${envs.AWS_BUCKET_NAME}/mocked-uuid`,
      });
    });
  });

  describe('deleteFile', () => {
    it('should delete a file from S3', async () => {
      (s3Client.send as jest.Mock).mockResolvedValue({});
      await service.deleteFile('mocked-uuid');
      expect(s3Client.send).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));
    });
  });
});
