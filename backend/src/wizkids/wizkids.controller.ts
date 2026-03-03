import { Controller, Get } from '@nestjs/common';
import { WizkidsService } from './wizkids.service';

@Controller('wizkids')
export class WizkidsController {
  constructor(private readonly wizkidsService: WizkidsService) {}

  @Get()
  async list() {
    return this.wizkidsService.findAll();
  }
}
