import { DataSource } from 'typeorm';

import { Document } from '../entities/document.entity';

export const DOCUMENT_REPOSITORY = 'DOCUMENT_REPOSITORY';

export const documentProvider = [
  {
    provide: DOCUMENT_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Document),
    inject: ['DATA_SOURCE'],
  },
];
