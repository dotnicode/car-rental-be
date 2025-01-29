import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CarModule } from './modules/car/car.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [DatabaseModule, CarModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
