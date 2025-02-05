import { DatabaseModule } from 'src/database/database.module';

import { Module } from '@nestjs/common';

import { CarController } from './car.controller';
import { CarService } from './car.service';
import { carProvider } from './providers/car.provider';
import { pictureProvider } from './providers/picture.provider';
import { S3StorageService } from '../utils/s3-storage.service';
import { UtilsModule } from '../utils/utils.module';
@Module({
  imports: [DatabaseModule, UtilsModule],
  controllers: [CarController],
  providers: [...carProvider, ...pictureProvider, CarService],
  exports: [CarService],
})
export class CarModule {}
