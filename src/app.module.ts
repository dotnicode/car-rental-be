import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CarModule } from './modules/car/car.module';
import { UtilsModule } from './modules/utils/utils.module';

@Module({
  imports: [DatabaseModule, CarModule, UtilsModule],
})
export class AppModule {}
