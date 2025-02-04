import { DatabaseModule } from 'src/database/database.module';

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthModule } from '../auth/auth.module';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AwsCognitoService } from './aws-cognito.service';
import { userProvider } from './providers/user.provider';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, ...userProvider, AwsCognitoService],
  exports: [],
})
export class UserModule {}
