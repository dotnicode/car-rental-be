import { FindOptionsRelations, Repository } from 'typeorm';

import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { PictureService } from '../picture/picture.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';
import { CAR_REPOSITORY } from './providers/car.provider';

@Injectable()
export class CarService {
  constructor(
    @Inject(CAR_REPOSITORY)
    private readonly carRepository: Repository<Car>,
    @Inject(forwardRef(() => PictureService))
    private readonly pictureService: PictureService,
  ) {}

  async create(createCarDto: CreateCarDto) {
    return await this.carRepository.save(createCarDto);
  }

  async findAll() {
    return await this.carRepository.find({ relations: { pictures: true } });
  }

  async findOne(id: string, relations: FindOptionsRelations<Car> = { pictures: true }) {
    try {
      const car = await this.carRepository.findOne({
        where: { id },
        relations,
      });
      if (!car) throw new BadRequestException(`Car #${id} not found`);

      return car;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateCarDto: UpdateCarDto) {
    const car = await this.findOne(id);
    const currentPictures = car.pictures || [];
    const newPictureIds = updateCarDto.pictureIds || [];

    const picturesToDelete = currentPictures
      .filter((picture) => !newPictureIds.includes(picture.id))
      .map((picture) => picture.id);

    if (picturesToDelete.length > 0) {
      await Promise.all(picturesToDelete.map((pictureId) => this.pictureService.remove(pictureId)));
    }

    Object.assign(car, {
      ...updateCarDto,
      pictures: newPictureIds.map((pictureId) => ({ id: pictureId })),
    });

    return await this.carRepository.save(car);
  }

  async remove(id: string) {
    const car = await this.findOne(id);
    const pictureIds = car.pictures?.map((picture) => picture.id);

    if (pictureIds) {
      await Promise.all(pictureIds.map((pictureId) => this.pictureService.remove(pictureId)));
    }

    await this.carRepository.delete(id);

    return { message: `Car #${id} deleted successfully` };
  }
}
