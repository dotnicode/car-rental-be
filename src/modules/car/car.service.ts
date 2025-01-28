import { FindOptionsRelations, Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';

import { DatabaseException } from '../../common/exceptions/database.exception';
import { CAR_REPOSITORY } from './providers/car.provider';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';
import { CarNotFoundException } from './exceptions/car-not-found.exception';
import { Picture } from './entities/picture.entity';
import { PICTURE_REPOSITORY } from './providers/picture.provider';
import { UploadPictureDto } from './dto/upload-picture.dto';
import { S3ConfigProvider } from './providers/s3.provider';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { uploadPicture } from './utils/upload-picture';

@Injectable()
export class CarService {
  constructor(
    @Inject(CAR_REPOSITORY)
    private readonly carRepository: Repository<Car>,

    @Inject(PICTURE_REPOSITORY)
    private readonly pictureRepository: Repository<Picture>,
  ) {}

  async create(createCarDto: CreateCarDto) {
    return await this.carRepository.save(createCarDto);
  }

  async findAll() {
    return await this.carRepository.find({ relations: { pictures: true } });
  }

  async findOne(
    id: number,
    relations: FindOptionsRelations<Car> = { pictures: true },
  ) {
    try {
      const car = await this.carRepository.findOne({
        where: { id },
        relations,
      });
      if (!car) throw new CarNotFoundException(id);

      return car;
    } catch (error) {
      if (error instanceof CarNotFoundException) throw error;
      throw new DatabaseException('Error accessing database');
    }
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    await this.carRepository.update(id, updateCarDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    await this.carRepository.delete(id);
    return { message: `Car #${id} deleted successfully` };
  }

  /*
   * Picture management
   */

  async uploadCarPicture(
    carId: number,
    file: Express.Multer.File,
    uploadPictureDto: UploadPictureDto,
  ) {
    const car = await this.findOne(carId, { pictures: false });
    const existingPicture = await this.pictureRepository.findOne({
      where: {
        car: { id: carId },
        type: uploadPictureDto.type,
      },
    });
    const uploadedPicture = await uploadPicture(file);

    const picture = existingPicture
      ? existingPicture
      : Object.assign(new Picture(), { car });
    picture.src = uploadedPicture.imageUrl;
    picture.description = uploadPictureDto.description;
    picture.title = uploadPictureDto.title ?? file.originalname;
    picture.type = uploadPictureDto.type;
    picture.date = uploadPictureDto.date;

    const savedPicture = await this.pictureRepository.save(picture);

    return {
      message: existingPicture
        ? 'Picture updated successfully'
        : 'Picture uploaded successfully',
      picture: savedPicture,
      car,
    };
  }
}
