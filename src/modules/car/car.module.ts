import { DatabaseModule } from 'src/database/database.module';

import { Module } from '@nestjs/common';

import { CarController } from './car.controller';
import { carProvider } from './car.provider';
import { CarService } from './car.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CarController],
  providers: [...carProvider, CarService],
  exports: [CarService],
})
export class CarModule {}
