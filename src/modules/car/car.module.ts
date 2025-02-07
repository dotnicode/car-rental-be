import { DatabaseModule } from 'src/database/database.module';

import { Module } from '@nestjs/common';

import { CarController } from './car.controller';
import { CarService } from './car.service';
import { carProvider } from './providers/car.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [CarController],
  providers: [CarService, ...carProvider],
  exports: [CarService],
})
export class CarModule {}
