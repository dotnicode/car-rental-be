import { AWSS3StorageService } from '../aws-s3-storage.service';

export const STORAGE_SERVICE = 'STORAGE_SERVICE';

export const storageProvider = [
  {
    provide: STORAGE_SERVICE,
    useClass: AWSS3StorageService,
  },
];
