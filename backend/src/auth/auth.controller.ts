import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { WizkidsService } from '../wizkids/wizkids.service';
import { toPrivateView } from '../wizkids/mappers/wizkid.mapper';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly wizkidsService: WizkidsService,
  ) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: any) {
    const wizkid = await this.wizkidsService.findById(req.user.userId);
    return toPrivateView(wizkid);
  }
}
