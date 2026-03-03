import { Controller, Get, Query } from '@nestjs/common';
import { ListWizkidsQuery } from './dto/list-wizkids.query';
import { toPublicView } from './mappers/wizkid.mapper';
import { WizkidsService } from './wizkids.service';

@Controller('wizkids')
export class WizkidsController {
  constructor(private readonly wizkidsService: WizkidsService) {}

  @Get()
  async list(@Query() query: ListWizkidsQuery) {
    const wizkids = await this.wizkidsService.findAll(query);
    return wizkids.map(toPublicView);
  }
}
