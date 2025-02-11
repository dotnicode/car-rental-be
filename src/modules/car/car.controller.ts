import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  async create(@Body() createCarDto: CreateCarDto) {
    return await this.carService.create(createCarDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll() {
    return await this.carService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.carService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return await this.carService.update(id, updateCarDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.carService.remove(id);
  }
}
