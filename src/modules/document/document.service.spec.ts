import { FileType } from 'src/common/enums/file-type.enum';
import { Role } from 'src/common/enums/role.enum';

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createTestFile = (name: string, type: string): Express.Multer.File =>
      ({
        buffer: Buffer.from('test'),
        originalname: name,
        mimetype: type,
      }) as Express.Multer.File;

    const createDocumentDto: CreateDocumentDto = {
      title: 'Test Document',
      description: 'Test Description',
      userId: '1',
    };

    it('should create a document', async () => {
      const file = createTestFile('test.pdf', 'application/pdf');

      const storageResponse = {
        fileKey: 'test',
        fileUrl: 'https://test.com',
      };

      const documentToSave = {
        ...createDocumentDto,
        src: storageResponse.fileKey,
        url: storageResponse.fileUrl,
        user: { id: createDocumentDto.userId },
      };

      const expectedDocument = {
        id: 'bocajrs',
        ...documentToSave,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: createDocumentDto.userId },
      };

      mockStorageService.uploadFile.mockResolvedValue(storageResponse);
      mockDocumentRepository.save.mockResolvedValue(expectedDocument);

      const document = await service.create(file, createDocumentDto);

      expect(document).toEqual(expectedDocument);
      expect(mockStorageService.uploadFile).toHaveBeenCalledWith(file, FileType.DOCUMENT);
      expect(mockDocumentRepository.save).toHaveBeenCalledWith(documentToSave);
    });

    it('should throw an error if the file type is not allowed', async () => {
      const txtFile = createTestFile('test.txt', 'text/plain');
      const imageFile = createTestFile('test.jpg', 'image/jpeg');

      mockStorageService.uploadFile.mockRejectedValue(
        new BadRequestException('File type not allowed for document'),
      );

      await expect(service.create(txtFile, createDocumentDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(imageFile, createDocumentDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockStorageService.uploadFile).toHaveBeenCalledWith(txtFile, FileType.DOCUMENT);
      expect(mockStorageService.uploadFile).toHaveBeenCalledWith(imageFile, FileType.DOCUMENT);
      expect(mockDocumentRepository.save).not.toHaveBeenCalled();
    });

    it('should accept PDF and DOCX files', async () => {
      const pdfFile = createTestFile('test.pdf', 'application/pdf');
      const docxFile = createTestFile(
        'test.docx',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      );
      const docFile = createTestFile('test.doc', 'application/msword');

      const storageResponse = {
        fileKey: 'test',
        fileUrl: 'https://test.com',
      };

      const documentToSave = {
        ...createDocumentDto,
        src: storageResponse.fileKey,
        url: storageResponse.fileUrl,
      };

      const expectedDocument = {
        id: 'bocajrs',
        ...documentToSave,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockStorageService.uploadFile.mockResolvedValue(storageResponse);
      mockDocumentRepository.save.mockResolvedValue(expectedDocument);

      await expect(service.create(pdfFile, createDocumentDto)).resolves.toBeDefined();
      await expect(service.create(docxFile, createDocumentDto)).resolves.toBeDefined();
      await expect(service.create(docFile, createDocumentDto)).resolves.toBeDefined();

      expect(mockStorageService.uploadFile).toHaveBeenCalledWith(pdfFile, FileType.DOCUMENT);
      expect(mockStorageService.uploadFile).toHaveBeenCalledWith(docxFile, FileType.DOCUMENT);
      expect(mockStorageService.uploadFile).toHaveBeenCalledWith(docFile, FileType.DOCUMENT);
    });
  });

  describe('findAll', () => {
    it('should return all documents', async () => {
      const mockDocuments = [
        {
          id: '1',
          title: 'Test Document 1',
          description: 'Test Description 1',
          url: 'https://test1.com',
          src: 'test1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          title: 'Test Document 2',
          description: 'Test Description 2',
          url: 'https://test2.com',
          src: 'test2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockDocumentRepository.find.mockResolvedValue(mockDocuments);

      const documents = await service.findAll();

      expect(mockDocumentRepository.find).toHaveBeenCalled();
      expect(documents).toEqual(mockDocuments);
    });

    it('should return empty array when documents are not found', async () => {
      mockDocumentRepository.find.mockResolvedValue([]);

      const documents = await service.findAll();

      expect(mockDocumentRepository.find).toHaveBeenCalled();
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
      user: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        dob: new Date(),
        role: Role.CLIENT,
        createdAt: new Date(),
        updatedAt: new Date(),
        documents: [],
        rents: [],
        adminRents: [],
      },
    };

    it('should return a document by id', async () => {
      mockDocumentRepository.findOne.mockResolvedValue(mockDocument);

      const document = await service.findOne('1');

      expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(document).toEqual(mockDocument);
    });

    it('should throw an error if the document is not found', async () => {
      mockDocumentRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
      expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
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
