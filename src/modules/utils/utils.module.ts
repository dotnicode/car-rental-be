import { Module } from '@nestjs/common';
import { S3StorageService } from './s3-storage.service';
import { S3ConfigProvider } from './providers/s3.provider';

@Module({
  providers: [S3ConfigProvider, S3StorageService],
  exports: [S3StorageService],
})
export class UtilsModule {}
