import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CarService } from '../car/car.service';
import { S3StorageService } from '../utils/s3-storage.service';
import { UploadPictureDto } from './dto/upload-picture.dto';
import { Picture } from './entities/picture.entity';
import { PICTURE_REPOSITORY } from './providers/picture.provider';

@Injectable()
export class PictureService {
  constructor(
    @Inject(PICTURE_REPOSITORY)
    private readonly pictureRepository: Repository<Picture>,
    private readonly s3StorageService: S3StorageService,
    private readonly carService: CarService,
  ) {}

  async upload(
    file: Express.Multer.File,
    uploadPictureDto: UploadPictureDto,
  ): Promise<Picture> {
    await this.carService.findOne(uploadPictureDto.carId);

    const { fileUrl } = await this.s3StorageService.uploadFile(file);

    return this.pictureRepository.save({
      ...uploadPictureDto,
      src: fileUrl,
      car: {
        id: uploadPictureDto.carId,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const picture = await this.pictureRepository.findOne({
      where: { id },
    });

    if (!picture) {
      throw new Error('Picture not found');
    }

    await this.s3StorageService.deleteFile(picture.fileKey);
    await this.pictureRepository.delete(id);
  }
}
