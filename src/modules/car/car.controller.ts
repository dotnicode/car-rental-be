import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

import {
  BadRequestException, Body, Controller, Delete, Get, MaxFileSizeValidator, Param, ParseFilePipe,
  ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { UploadPictureDto } from './dto/upload-picture.dto';

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
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.carService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCarDto: UpdateCarDto) {
    return await this.carService.update(+id, updateCarDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.carService.remove(+id);
  }

  /*
   * Picture management
   */

  @Post(':id/picture')
  @UseInterceptors(FileInterceptor('image'))
  async uploadCarPicture(
    @Param('id', ParseIntPipe) carId: number,
    @UploadedFile(
      new ParseFilePipe({
        // Maximo de 5MB
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
    @Body() uploadPictureDto: UploadPictureDto,
  ) {
    const plainUploadPictureDto = plainToInstance(UploadPictureDto, uploadPictureDto);
    const errors: ValidationError[] = await validate(plainUploadPictureDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors.map((e) => e.constraints));
    }

    return this.carService.uploadCarPicture(carId, file, plainUploadPictureDto);
  }
}
