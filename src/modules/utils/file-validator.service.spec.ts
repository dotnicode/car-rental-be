import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { FileValidatorService } from './file-validator.service';
import { FileType } from 'src/common/enums/file-type.enum';

describe('FileValidatorService', () => {
  let service: FileValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileValidatorService],
    }).compile();

    service = module.get<FileValidatorService>(FileValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateFile', () => {
    it('should validate PDF document successfully', () => {
      const file = {
        mimetype: 'application/pdf',
      } as Express.Multer.File;

      expect(() => service.validateFile(file, FileType.DOCUMENT)).not.toThrow();
    });

    it('should validate DOC document successfully', () => {
      const file = {
        mimetype: 'application/msword',
      } as Express.Multer.File;

      expect(() => service.validateFile(file, FileType.DOCUMENT)).not.toThrow();
    });

    it('should validate DOCX document successfully', () => {
      const file = {
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      } as Express.Multer.File;

      expect(() => service.validateFile(file, FileType.DOCUMENT)).not.toThrow();
    });

    it('should validate JPG picture successfully', () => {
      const file = {
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      expect(() => service.validateFile(file, FileType.PICTURE)).not.toThrow();
    });

    it('should validate PNG picture successfully', () => {
      const file = {
        mimetype: 'image/png',
      } as Express.Multer.File;

      expect(() => service.validateFile(file, FileType.PICTURE)).not.toThrow();
    });

    it('should throw BadRequestException for invalid document type', () => {
      const file = {
        mimetype: 'image/png',
      } as Express.Multer.File;

      expect(() => service.validateFile(file, FileType.DOCUMENT)).toThrow(BadRequestException);
      expect(() => service.validateFile(file, FileType.DOCUMENT)).toThrow(
        'File type not allowed for document',
      );
    });

    it('should throw BadRequestException for invalid picture type', () => {
      const file = {
        mimetype: 'application/pdf',
      } as Express.Multer.File;

      expect(() => service.validateFile(file, FileType.PICTURE)).toThrow(BadRequestException);
      expect(() => service.validateFile(file, FileType.PICTURE)).toThrow(
        'File type not allowed for picture',
      );
    });
  });
});
