import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CarModule } from './modules/car/car.module';
import { UtilsModule } from './modules/utils/utils.module';

@Module({
  imports: [DatabaseModule, CarModule, UtilsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
