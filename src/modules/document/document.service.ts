import { Repository } from 'typeorm';

import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { FileType } from 'src/common/enums/file-type.enum';
import { AWSS3StorageService } from '../utils/aws-s3-storage.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document } from './entities/document.entity';
import { DOCUMENT_REPOSITORY } from './providers/document.provider';

@Injectable()
export class DocumentService {
  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: Repository<Document>,
    private readonly storageService: AWSS3StorageService,
  ) {}

  async create(file: Express.Multer.File, createDocumentDto: CreateDocumentDto) {
    try {
      const { fileKey, fileUrl } = await this.storageService.uploadFile(file, FileType.DOCUMENT);

      const document = await this.documentRepository.save({
        ...createDocumentDto,
        url: fileUrl,
        src: fileKey,
      });

      return document;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }

      throw new Error('Upload failed');
    }
  }

  async findAll() {
    return await this.documentRepository.find();
  }

  async findOne(id: string) {
    const document = await this.documentRepository.findOne({ where: { id } });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  async remove(id: string) {
    const result = await this.documentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return {
      message: `Document with ID ${id} deleted successfully`,
    };
  }
}
