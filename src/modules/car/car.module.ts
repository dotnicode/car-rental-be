import { DatabaseModule } from 'src/database/database.module';

import { Module, forwardRef } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { carProvider } from './providers/car.provider';
import { PictureModule } from '../picture/picture.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => PictureModule), UserModule, AuthModule],
  controllers: [CarController],
  providers: [CarService, ...carProvider],
  exports: [CarService],
})
export class CarModule {}
