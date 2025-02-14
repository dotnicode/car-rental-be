import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AWSS3StorageService } from '../utils/aws-s3-storage.service';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document } from './entities/document.entity';
import { DOCUMENT_REPOSITORY } from './providers/document.provider';

describe('DocumentService', () => {
  let service: DocumentService;

  const mockDocumentRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  const mockStorageService = {
    uploadFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: DOCUMENT_REPOSITORY,
          useValue: mockDocumentRepository,
        },
        {
          provide: AWSS3StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  describe('create', () => {
    it('should create a document', () => {
      const file = {
        buffer: Buffer.from('test'),
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
      } as Express.Multer.File;
      const createDocumentDto: CreateDocumentDto = {
        title: 'Test Document',
        description: 'Test Description',
      };

      const expectedDocument = {
        id: 'bocajrs',
        ...createDocumentDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockStorageService.uploadFile.mockResolvedValue({
        fileKey: 'test',
        fileUrl: 'https://test.com',
      });
      mockDocumentRepository.save.mockResolvedValue(expectedDocument);

      const document = service.create(file, createDocumentDto);

      expect(document).toEqual(expectedDocument);
      expect(mockStorageService.uploadFile).toHaveBeenCalledWith(file);
      expect(mockDocumentRepository.save).toHaveBeenCalledWith(createDocumentDto);
    });

    it('should throw an error if the file is not a pdf or docx', async () => {
      const filePDF = {
        buffer: Buffer.from('test'),
        originalname: 'test.txt',
        mimetype: 'text/plain',
      } as Express.Multer.File;

      const fileDOCX = {
        buffer: Buffer.from('test'),
        originalname: 'test.docx',
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      } as Express.Multer.File;

      const createDocumentDto: CreateDocumentDto = {
        title: 'Test Wrong Document',
        description: 'Test Wrong Description',
      };

      mockStorageService.uploadFile.mockRejectedValue(
        new BadRequestException('File type not allowed'),
      );

      await expect(service.create(filePDF, createDocumentDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(fileDOCX, createDocumentDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockStorageService.uploadFile).toHaveBeenCalledWith(filePDF);
      expect(mockStorageService.uploadFile).toHaveBeenCalledWith(fileDOCX);
      expect(mockDocumentRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all documents', () => {
      const documents = service.findAll();
      expect(documents).toEqual([]);
    });
  });

  describe('findOne', () => {
    const mockDocument: Document = {
      id: '1',
      title: 'Test Document',
      description: 'Test Description',
      url: 'https://test.com',
      src: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return a document by id', async () => {
      mockDocumentRepository.findOne.mockResolvedValue(mockDocument);

      const document = await service.findOne('1');

      expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(document).toEqual(mockDocument);
    });

    it('should throw an error if the document is not found', async () => {
      mockDocumentRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
      expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('remove', () => {
    const mockDocument = {
      id: '1',
    };

    it('should remove a document by id', async () => {
      mockDocumentRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(mockDocument.id);

      expect(mockDocumentRepository.delete).toHaveBeenCalledWith(mockDocument.id);
      expect(result).toEqual({
        message: `Document with ID ${mockDocument.id} deleted successfully`,
      });
    });

    it('should throw NotFoundException when document does not exist', async () => {
      mockDocumentRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(mockDocument.id)).rejects.toThrow(NotFoundException);
      expect(mockDocumentRepository.delete).toHaveBeenCalledWith(mockDocument.id);
    });
  });
});
