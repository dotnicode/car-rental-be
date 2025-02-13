import { DatabaseModule } from 'src/database/database.module';

import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { AwsCognitoService } from './aws-cognito.service';
import { userProvider } from './providers/user.provider';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, ...userProvider, AwsCognitoService],
  exports: [],
})
export class UserModule {}
