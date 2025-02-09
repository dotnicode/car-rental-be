import { forwardRef, Module } from '@nestjs/common';
import { PictureService } from './picture.service';
import { PictureController } from './picture.controller';
import { CarModule } from '../car/car.module';
import { pictureProvider } from './providers/picture.provider';
import { DatabaseModule } from 'src/database/database.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => CarModule), UtilsModule],
  controllers: [PictureController],
  providers: [PictureService, ...pictureProvider],
  exports: [PictureService],
})
export class PictureModule {}
