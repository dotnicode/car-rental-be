import { Test, TestingModule } from '@nestjs/testing';
import { PictureController } from './picture.controller';
import { PictureService } from './picture.service';
import { PictureType } from './enums/picture-type.enum';

describe('PictureController', () => {
  let controller: PictureController;
  let service: PictureService;

  const mockPictureService = {
    upload: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PictureController],
      providers: [
        {
          provide: PictureService,
          useValue: mockPictureService,
        },
      ],
    }).compile();

    controller = module.get<PictureController>(PictureController);
    service = module.get<PictureService>(PictureService);
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

      const expectedPicture = {
        id: 1,
        src: 'https://mocked-bucket.s3.amazonaws.com/abc-123',
        ...uploadPictureDto,
        car: { id: uploadPictureDto.carId },
      };

      mockPictureService.upload.mockResolvedValue(expectedPicture);

      const result = await controller.upload(mockFile, uploadPictureDto);

      expect(mockPictureService.upload).toHaveBeenCalledWith(
        mockFile,
        uploadPictureDto,
      );
      expect(result).toEqual(expectedPicture);
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

      mockPictureService.upload.mockRejectedValue(new Error('Upload failed'));

      await expect(
        controller.upload(mockFile, uploadPictureDto),
      ).rejects.toThrow('Upload failed');
    });
  });

  describe('remove', () => {
    it('should remove a picture successfully', async () => {
      const pictureId = '1';

      mockPictureService.remove.mockResolvedValue({
        message: 'Picture deleted successfully',
      });

      const result = await controller.remove(pictureId);

      expect(mockPictureService.remove).toHaveBeenCalledWith(pictureId);
      expect(result).toEqual({ message: 'Picture deleted successfully' });
    });

    it('should handle remove failure', async () => {
      const pictureId = '999';

      mockPictureService.remove.mockRejectedValue(
        new Error('Picture not found'),
      );

      await expect(controller.remove(pictureId)).rejects.toThrow(
        'Picture not found',
      );
    });
  });
});
