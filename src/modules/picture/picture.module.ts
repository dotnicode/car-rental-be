import { Module } from '@nestjs/common';
import { PictureService } from './picture.service';
import { PictureController } from './picture.controller';
import { CarModule } from '../car/car.module';
import { pictureProvider } from './providers/picture.provider';
import { DatabaseModule } from 'src/database/database.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [DatabaseModule, CarModule, UtilsModule],
  controllers: [PictureController],
  providers: [PictureService, ...pictureProvider],
})
export class PictureModule {}
