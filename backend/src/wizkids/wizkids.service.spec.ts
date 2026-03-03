import { Test, TestingModule } from '@nestjs/testing';
import { WizkidsService } from './wizkids.service';

describe('WizkidsService', () => {
  let service: WizkidsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WizkidsService],
    }).compile();

    service = module.get<WizkidsService>(WizkidsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
