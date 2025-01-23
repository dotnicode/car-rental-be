import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from './database.module';

describe('Database', () => {
  let provider: DatabaseModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseModule],
    }).compile();

    provider = module.get<DatabaseModule>(DatabaseModule);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
