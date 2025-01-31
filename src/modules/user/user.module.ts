import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { userProvider } from './providers/user.provider';
import { DatabaseModule } from 'src/database/database.module';
import { AwsCognitoService } from './aws-cognito.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, ...userProvider, AwsCognitoService],
})
export class UserModule {}
