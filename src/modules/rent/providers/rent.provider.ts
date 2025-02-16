import { DataSource } from 'typeorm';
import { Rent } from '../entities/rent.entity';

export const RENT_REPOSITORY = 'RENT_REPOSITORY';

export const rentProvider = [
  {
    provide: RENT_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Rent),
    inject: ['DATA_SOURCE'],
  },
];
