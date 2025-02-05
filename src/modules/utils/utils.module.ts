import { Module } from '@nestjs/common';

import { S3ConfigProvider } from './providers/s3.provider';
import { storageProvider } from './providers/storage.provider';
import { S3StorageService } from './s3-storage.service';

@Module({
  providers: [S3ConfigProvider, S3StorageService, ...storageProvider],
  exports: [S3StorageService, ...storageProvider],
})
export class UtilsModule {}
