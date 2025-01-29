import { DataSource } from 'typeorm';

import { Car } from '../entities/car.entity';

export const CAR_REPOSITORY = 'CAR_REPOSITORY';

export const carProvider = [
  {
    provide: CAR_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Car),
    inject: ['DATA_SOURCE'],
  },
];
