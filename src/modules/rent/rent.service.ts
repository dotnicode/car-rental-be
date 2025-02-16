import { Repository } from 'typeorm';

import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

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
    const { carId, userId, adminId, ...rent } = createRentDto;

    try {
      await this.carService.findOne(carId);
      await this.userService.findOne({ id: userId });
      await this.userService.findOne({ id: adminId });

      return await this.rentRepository.save({
        ...rent,
        car: { id: carId },
        user: { id: userId },
        admin: { id: adminId },
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    return await this.rentRepository.find({ relations: { car: true, user: true } });
  }

  async findOne(id: string) {
    const rent = await this.rentRepository.findOne({
      where: { id },
      relations: { car: true, user: true },
    });
    if (!rent) throw new BadRequestException(`Rent #${id} not found`);

    return rent;
  }

  async update(id: string, updateRentDto: UpdateRentDto) {
    return await this.rentRepository.update(id, updateRentDto);
  }

  async remove(id: string) {
    const result = await this.rentRepository.delete(id);
    if (result.affected === 0) throw new BadRequestException(`Rent #${id} not found`);

    return result;
  }
}
