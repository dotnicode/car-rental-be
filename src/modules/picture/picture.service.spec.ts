import { Test, TestingModule } from '@nestjs/testing';
import { PictureService } from './picture.service';
import { PictureType } from './enums/picture-type.enum';
import { Repository } from 'typeorm';
import { Picture } from './entities/picture.entity';
import { S3StorageService } from '../utils/s3-storage.service';
import { CarService } from '../car/car.service';
import { PICTURE_REPOSITORY } from './providers/picture.provider';

describe('PictureService', () => {
  let service: PictureService;
  let repository: Repository<Picture>;
  let storageService: S3StorageService;
  let carService: CarService;

  const mockPictureRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
  };

  const mockS3StorageService = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  const mockCarService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PictureService,
        {
          provide: PICTURE_REPOSITORY,
          useValue: mockPictureRepository,
        },
        {
          provide: S3StorageService,
          useValue: mockS3StorageService,
        },
        {
          provide: CarService,
          useValue: mockCarService,
        },
      ],
    }).compile();

    service = module.get<PictureService>(PictureService);
    repository = module.get<Repository<Picture>>(PICTURE_REPOSITORY);
    storageService = module.get<S3StorageService>(S3StorageService);
    carService = module.get<CarService>(CarService);
  });

  describe('upload', () => {
    it('should upload a picture successfully', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1024,
      } as Express.Multer.File;

      const uploadPictureDto = {
        title: 'Mi coche',
        type: PictureType.FRONT,
        date: new Date(),
        description: 'Vista frontal del coche',
        carId: 'asdf-qwer-zxcv',
      };

      const car = { id: uploadPictureDto.carId };
      const uploadResult = {
        fileKey: 'abc-123',
        fileUrl: 'https://mocked-bucket.s3.amazonaws.com/abc-123',
      };

      const expectedPicture = {
        id: 1,
        src: uploadResult.fileUrl,
        ...uploadPictureDto,
        car,
      };

      mockCarService.findOne.mockResolvedValue(car);
      mockS3StorageService.uploadFile.mockResolvedValue(uploadResult);
      mockPictureRepository.save.mockResolvedValue(expectedPicture);

      const result = await service.upload(mockFile, uploadPictureDto);

      expect(mockCarService.findOne).toHaveBeenCalledWith(
        uploadPictureDto.carId,
      );
      expect(mockS3StorageService.uploadFile).toHaveBeenCalledWith(mockFile);
      expect(mockPictureRepository.save).toHaveBeenCalledWith({
        ...uploadPictureDto,
        src: uploadResult.fileUrl,
        car: { id: uploadPictureDto.carId },
      });
      expect(result).toEqual(expectedPicture);
    });

    it('should throw error if car not found', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1024,
      } as Express.Multer.File;

      const uploadPictureDto = {
        title: 'Mi coche',
        type: PictureType.FRONT,
        date: new Date(),
        description: 'Vista frontal del coche',
        carId: 'non-existent-id',
      };

      mockCarService.findOne.mockRejectedValue(new Error('Car not found'));

      await expect(service.upload(mockFile, uploadPictureDto)).rejects.toThrow(
        'Car not found',
      );
    });

    it('should handle upload failure', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1024,
      } as Express.Multer.File;

      const uploadPictureDto = {
        title: 'Mi coche',
        type: PictureType.FRONT,
        date: new Date(),
        description: 'Vista frontal del coche',
        carId: 'asdf-qwer-zxcv',
      };

      const car = { id: uploadPictureDto.carId };
      mockCarService.findOne.mockResolvedValue(car);

      mockS3StorageService.uploadFile.mockRejectedValue(
        new Error('Upload failed'),
      );

      await expect(service.upload(mockFile, uploadPictureDto)).rejects.toThrow(
        'Upload failed',
      );
    });
  });

  describe('remove', () => {
    it('should remove a picture and its file successfully', async () => {
      const pictureId = 1;
      const picture = {
        id: pictureId,
        src: 'https://bucket.s3.amazonaws.com/abc-123',
        fileKey: 'abc-123',
      };

      mockPictureRepository.findOne.mockResolvedValue(picture);
      mockPictureRepository.delete.mockResolvedValue({ affected: 1 });
      mockS3StorageService.deleteFile.mockResolvedValue(undefined);

      await service.remove(pictureId);

      expect(mockPictureRepository.findOne).toHaveBeenCalledWith({
        where: { id: pictureId },
      });
      expect(mockS3StorageService.deleteFile).toHaveBeenCalledWith('abc-123');
      expect(mockPictureRepository.delete).toHaveBeenCalledWith(pictureId);
    });

    it('should throw error if picture not found', async () => {
      const pictureId = 999;
      mockPictureRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(pictureId)).rejects.toThrow(
        'Picture not found',
      );
    });

    it('should handle S3 deletion failure', async () => {
      const pictureId = 1;
      const picture = {
        id: pictureId,
        src: 'https://bucket.s3.amazonaws.com/abc-123',
        fileKey: 'abc-123',
      };

      mockPictureRepository.findOne.mockResolvedValue(picture);
      mockS3StorageService.deleteFile.mockRejectedValue(
        new Error('Delete failed'),
      );

      await expect(service.remove(pictureId)).rejects.toThrow('Delete failed');
    });
  });
});
