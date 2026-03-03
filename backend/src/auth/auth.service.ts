import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { WizkidsService } from '../wizkids/wizkids.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly wizkidsService: WizkidsService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const wizkid = await this.wizkidsService.findByEmail(email);

    // no password provided
    if (!wizkid || !wizkid.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // user is fired
    if (wizkid.firedAt) {
      throw new UnauthorizedException('Account is disabled');
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      wizkid.passwordHash,
    );
    if (!isPasswordCorrect)
      throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: wizkid._id, role: wizkid.role };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
