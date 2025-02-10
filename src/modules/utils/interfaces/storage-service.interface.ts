import IFileUploadResult from './file-upload-result.interface';

export default interface IStorageService {
  uploadFile(file: Express.Multer.File): Promise<IFileUploadResult>;
  deleteFile(key: string): Promise<void>;
}
