import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateWizkidDto } from './dto/create-wizkid.dto';
import { ListWizkidsQuery } from './dto/list-wizkids.query';
import { toPrivateView, toPublicView } from './mappers/wizkid.mapper';
import { WizkidsService } from './wizkids.service';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';

@Controller('wizkids')
export class WizkidsController {
  constructor(private readonly wizkidsService: WizkidsService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async list(@Query() query: ListWizkidsQuery, @Req() req: any) {
    const wizkids = await this.wizkidsService.findAll(query);

    const isUser = !!req.user;
    const mapper = isUser ? toPrivateView : toPublicView;

    return wizkids.map(mapper);
  }

  @Post()
  async create(@Body() dto: CreateWizkidDto) {
    const created = await this.wizkidsService.createWizkid(dto);
    return toPublicView(created);
  }
}
