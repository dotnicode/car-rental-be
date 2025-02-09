import { FindOptionsRelations, Repository } from 'typeorm';

import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { DatabaseException } from '../../common/exceptions/database.exception';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';
import { CarNotFoundException } from './exceptions/car-not-found.exception';
import { CAR_REPOSITORY } from './providers/car.provider';
import { PictureService } from '../picture/picture.service';

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

  async findOne(
    id: string,
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
      throw new DatabaseException(`Error accessing database: ${error.message}`);
    }
  }

  async update(id: string, updateCarDto: UpdateCarDto) {
    await this.carRepository.update(id, updateCarDto);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const car = await this.findOne(id);
    const pictureIds = car.pictures?.map((picture) => picture.id);

    if (pictureIds) {
      await Promise.all(
        pictureIds.map((pictureId) => this.pictureService.remove(pictureId)),
      );
    }

    await this.carRepository.delete(id);

    return { message: `Car #${id} deleted successfully` };
  }
}
