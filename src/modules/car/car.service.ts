import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';

import { DatabaseException } from '../../common/exceptions/database.exception';
import { CAR_REPOSITORY } from './providers/car.provider';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';
import { CarNotFoundException } from './exceptions/car-not-found.exception';
import { Picture } from './entities/picture.entity';
import { PICTURE_REPOSITORY } from './providers/picture.provider';

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
    return await this.carRepository.find();
  }

  async findOne(id: number) {
    try {
      const car = await this.carRepository.findOne({ where: { id } });
      if (!car) {
        throw new CarNotFoundException(id);
      }
      return car;
    } catch (error) {
      if (error instanceof CarNotFoundException) {
        throw error;
      }
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
}
