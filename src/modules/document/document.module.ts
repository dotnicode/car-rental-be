import { DatabaseModule } from 'src/database/database.module';

import { Module } from '@nestjs/common';

import { UtilsModule } from '../utils/utils.module';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { documentProvider } from './providers/document.provider';

@Module({
  imports: [DatabaseModule, UtilsModule],
  controllers: [DocumentController],
  providers: [DocumentService, ...documentProvider],
  exports: [DocumentService],
})
export class DocumentModule {}
