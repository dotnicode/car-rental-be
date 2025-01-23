import { DataSource } from 'typeorm';

import { envs } from '../config/envs';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: envs.HOST,
        port: envs.DATABASE_PORT,
        username: envs.POSTGRES_USER,
        password: envs.POSTGRES_PASSWORD,
        database: envs.POSTGRES_DB,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
