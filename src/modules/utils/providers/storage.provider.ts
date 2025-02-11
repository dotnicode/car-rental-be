import { S3StorageService } from '../s3-storage.service';

export const STORAGE_SERVICE = 'STORAGE_SERVICE';

export const storageProvider = [
  {
    provide: STORAGE_SERVICE,
    useClass: S3StorageService,
  },
];
