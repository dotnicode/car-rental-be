import { Module } from '@nestjs/common';

import { AwsCognitoService } from './aws-cognito.service';
import { AWSS3StorageService } from './aws-s3-storage.service';
import { S3ConfigProvider } from './providers/s3.provider';
import { storageProvider } from './providers/storage.provider';

@Module({
  providers: [S3ConfigProvider, AWSS3StorageService, ...storageProvider, AwsCognitoService],
  exports: [AWSS3StorageService, ...storageProvider, AwsCognitoService],
})
export class UtilsModule {}
