import { DatabaseModule } from 'src/database/database.module';

import { Module } from '@nestjs/common';

import { UtilsModule } from '../utils/utils.module';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { carProvider } from './providers/car.provider';
import { pictureProvider } from './providers/picture.provider';

@Module({
  imports: [DatabaseModule, UtilsModule],
  controllers: [CarController],
  providers: [CarService, ...carProvider, ...pictureProvider],
  exports: [CarService],
})
export class CarModule {}
