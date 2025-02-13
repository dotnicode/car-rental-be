import { DatabaseModule } from 'src/database/database.module';

import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { userProvider } from './providers/user.provider';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [DatabaseModule, AuthModule, UtilsModule],
  controllers: [UserController],
  providers: [UserService, ...userProvider],
  exports: [],
})
export class UserModule {}
