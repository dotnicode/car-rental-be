import { Module } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { DatabaseModule } from 'src/database/database.module';
import { rentProvider } from './providers/rent.provider';
import { CarModule } from '../car/car.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DatabaseModule, CarModule, UserModule],
  controllers: [RentController],
  providers: [RentService, ...rentProvider],
  exports: [RentService],
})
export class RentModule {}
