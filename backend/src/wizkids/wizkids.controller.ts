import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateWizkidDto } from './dto/create-wizkid.dto';
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

  @Post()
  async create(@Body() dto: CreateWizkidDto) {
    const created = await this.wizkidsService.createWizkid(dto);
    return toPublicView(created);
  }
}
