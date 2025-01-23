import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { PictureModule } from './modules/picture/picture.module';
import { CarModule } from './modules/car/car.module';

@Module({
  imports: [DatabaseModule, PictureModule, CarModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
