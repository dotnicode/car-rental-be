import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileType } from 'src/common/enums/file-type.enum';
import { Repository } from 'typeorm';
import { CarService } from '../car/car.service';
import { AWSS3StorageService } from '../utils/aws-s3-storage.service';
import { UploadPictureDto } from './dto/upload-picture.dto';
import { Picture } from './entities/picture.entity';
import { PICTURE_REPOSITORY } from './providers/picture.provider';

@Injectable()
export class PictureService {
  constructor(
    @Inject(PICTURE_REPOSITORY)
    private readonly pictureRepository: Repository<Picture>,
    private readonly s3StorageService: AWSS3StorageService,
    @Inject(forwardRef(() => CarService))
    private readonly carService: CarService,
  ) {}

  async upload(file: Express.Multer.File, uploadPictureDto: UploadPictureDto): Promise<Picture> {
    try {
      const car = await this.carService.findOne(uploadPictureDto.carId);

      const { fileUrl, fileKey } = await this.s3StorageService.uploadFile(file, FileType.PICTURE);

      return await this.pictureRepository.save({
        ...uploadPictureDto,
        fileKey,
        src: fileUrl,
        car,
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const picture = await this.pictureRepository.findOne({
      where: { id },
    });

    if (!picture) {
      throw new Error('Picture not found');
    }

    await this.s3StorageService.deleteFile(picture.fileKey);
    await this.pictureRepository.delete(id);

    return { message: 'Picture deleted successfully' };
  }
}
