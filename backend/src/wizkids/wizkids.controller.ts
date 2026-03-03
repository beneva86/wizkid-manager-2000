import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateWizkidDto } from './dto/update-wizkid.dto';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-objectid.pipe';

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
    const createdWizkid = await this.wizkidsService.createWizkid(dto);
    return toPublicView(createdWizkid);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateWizkidDto,
  ) {
    const updatedWizkid = await this.wizkidsService.updateWizkid(id, dto);
    // we return the private view here because only authenticated users can update,
    // and they should see all the details of the updated wizkid
    return toPrivateView(updatedWizkid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    await this.wizkidsService.deleteWizkid(id);
  }
}
