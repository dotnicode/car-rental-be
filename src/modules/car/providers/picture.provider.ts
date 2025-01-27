import { DataSource } from 'typeorm';

import { Picture } from '../entities/picture.entity';

export const PICTURE_REPOSITORY = 'PICTURE_REPOSITORY';

export const pictureProvider = [
  {
    provide: PICTURE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Picture),
    inject: ['DATA_SOURCE'],
  },
];
