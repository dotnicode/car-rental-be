import { Module } from '@nestjs/common';

import { S3ConfigProvider } from './providers/s3.provider';
import { storageProvider } from './providers/storage.provider';
import { AWSS3StorageService } from './aws-s3-storage.service';
import { AwsCognitoService } from './aws-cognito.service';

@Module({
  providers: [S3ConfigProvider, AWSS3StorageService, ...storageProvider, AwsCognitoService],
  exports: [AWSS3StorageService, ...storageProvider, AwsCognitoService],
})
export class UtilsModule {}
