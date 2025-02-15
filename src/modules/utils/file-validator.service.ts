import { BadRequestException, Injectable } from '@nestjs/common';

import { FileType } from 'src/common/enums/file-type.enum';

@Injectable()
export class FileValidatorService {
  private readonly mimeTypeMap = {
    [FileType.DOCUMENT]: [
      'application/pdf',
      'application/msword', // doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    ],
    [FileType.PICTURE]: ['image/jpeg', 'image/png', 'image/jpg'],
  };

  /**
   * Validates that the file's MIME type matches the expected type
   * @param file - File to validate
   * @param type - Expected file type (DOCUMENT or PICTURE)
   * @throws {BadRequestException} If the file type is not allowed
   */
  validateFile(file: Express.Multer.File, type: FileType): void {
    const allowedMimeTypes = this.mimeTypeMap[type];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`File type not allowed for ${type.toLowerCase()}`);
    }
  }
}
