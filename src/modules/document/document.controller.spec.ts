import { Test, TestingModule } from '@nestjs/testing';

import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document } from './entities/document.entity';

describe('DocumentController', () => {
  let controller: DocumentController;
  let service: DocumentService;

  const mockDocumentService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: DocumentService,
          useValue: mockDocumentService,
        },
      ],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
    service = module.get<DocumentService>(DocumentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a document', async () => {
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
        src: 'test',
        url: 'https://test.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDocumentService.create.mockResolvedValue(expectedDocument);

      const result = await controller.create(file, createDocumentDto);

      expect(mockDocumentService.create).toHaveBeenCalledWith(file, createDocumentDto);
      expect(result).toEqual(expectedDocument);
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

      mockDocumentService.findAll.mockResolvedValue(mockDocuments);

      const result = await controller.findAll();

      expect(mockDocumentService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockDocuments);
    });
  });

  describe('findOne', () => {
    it('should return a document by id', async () => {
      const mockDocument: Document = {
        id: '1',
        title: 'Test Document',
        description: 'Test Description',
        url: 'https://test.com',
        src: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDocumentService.findOne.mockResolvedValue(mockDocument);

      const result = await controller.findOne('1');

      expect(mockDocumentService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockDocument);
    });
  });

  describe('remove', () => {
    it('should remove a document', async () => {
      const documentId = '1';
      const expectedResponse = {
        message: `Document with ID ${documentId} deleted successfully`,
      };

      mockDocumentService.remove.mockResolvedValue(expectedResponse);

      const result = await controller.remove(documentId);

      expect(mockDocumentService.remove).toHaveBeenCalledWith(documentId);
      expect(result).toEqual(expectedResponse);
    });
  });
});
