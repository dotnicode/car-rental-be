import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CarModule } from './modules/car/car.module';
import { UtilsModule } from './modules/utils/utils.module';
import { PictureModule } from './modules/picture/picture.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DocumentModule } from './modules/document/document.module';

@Module({
  imports: [
    DatabaseModule,
    CarModule,
    UserModule,
    AuthModule,
    UtilsModule,
    PictureModule,
    DocumentModule,
  ],
})
export class AppModule {}
