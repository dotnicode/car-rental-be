import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CarModule } from './modules/car/car.module';
import { UtilsModule } from './modules/utils/utils.module';
import { PictureModule } from './modules/picture/picture.module';

@Module({
  imports: [DatabaseModule, CarModule, UtilsModule, PictureModule],
})
export class AppModule {}
