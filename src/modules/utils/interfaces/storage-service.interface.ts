import { FileType } from 'src/common/enums/file-type.enum';
import IFileUploadResult from './file-upload-result.interface';

export default interface IStorageService {
  uploadFile(file: Express.Multer.File, fileType: FileType): Promise<IFileUploadResult>;
  deleteFile(key: string): Promise<void>;
}
