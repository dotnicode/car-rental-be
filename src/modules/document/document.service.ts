import { Repository } from 'typeorm';

import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { AWSS3StorageService } from '../utils/aws-s3-storage.service';
import { CreateDocumentDto } from './dto/create-document.dto';
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
      const { fileKey, fileUrl } = await this.storageService.uploadFile(file);

      return this.documentRepository.save({
        ...createDocumentDto,
        url: fileUrl,
        src: fileKey,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new Error('Upload failed');
    }
  }

  async findAll() {
    return `This action returns all document`;
  }

  async findOne(id: string) {
    return `This action returns a #${id} document`;
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
