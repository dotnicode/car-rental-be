import { DatabaseModule } from 'src/database/database.module';

import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { carProvider } from './providers/car.provider';
import { pictureProvider } from './providers/picture.provider';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule],
  controllers: [CarController],
  providers: [...carProvider, ...pictureProvider, CarService],
  exports: [CarService],
})
export class CarModule {}
