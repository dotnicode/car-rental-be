import { Repository } from 'typeorm';

import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { CarService } from '../car/car.service';
import { UserService } from '../user/user.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { Rent } from './entities/rent.entity';
import { RENT_REPOSITORY } from './providers/rent.provider';

@Injectable()
export class RentService {
  constructor(
    @Inject(RENT_REPOSITORY)
    private readonly rentRepository: Repository<Rent>,
    private readonly carService: CarService,
    private readonly userService: UserService,
  ) {}

  async create(createRentDto: CreateRentDto) {
    return await this.rentRepository.save(createRentDto);
  }

  async findAll() {
    return await this.rentRepository.find({ relations: { car: true, user: true } });
  }

  async findOne(id: string) {
    return await this.rentRepository.findOne({
      where: { id },
      relations: { car: true, user: true },
    });
  }

  async update(id: string, updateRentDto: UpdateRentDto) {
    return await this.rentRepository.update(id, updateRentDto);
  }

  async remove(id: string) {
    return await this.rentRepository.delete(id);
  }
}
