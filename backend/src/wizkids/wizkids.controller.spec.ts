import { Test, TestingModule } from '@nestjs/testing';
import { WizkidsController } from './wizkids.controller';

describe('WizkidsController', () => {
  let controller: WizkidsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WizkidsController],
    }).compile();

    controller = module.get<WizkidsController>(WizkidsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
