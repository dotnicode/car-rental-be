import { Test, TestingModule } from '@nestjs/testing';
import { AwsCognitoServiceTsService } from './aws-cognito.service.ts.service';

describe('AwsCognitoServiceTsService', () => {
  let service: AwsCognitoServiceTsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsCognitoServiceTsService],
    }).compile();

    service = module.get<AwsCognitoServiceTsService>(AwsCognitoServiceTsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
