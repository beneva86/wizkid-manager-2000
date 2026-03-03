import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { WizkidsService } from '../wizkids/wizkids.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly wizkidsService: WizkidsService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(email: string, password: string) {
    const wizkid = await this.wizkidsService.findByEmail(email);

    if (!wizkid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // no password provided
    if (!wizkid.passwordHash) {
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
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const secret = this.config.get<string>('JWT_SECRET');
    if (!secret) throw new Error('JWT_SECRET is not set');

    const accessToken = await this.jwtService.signAsync(
      { sub: wizkid._id.toString(), role: wizkid.role },
      { secret },
    );

    return { accessToken };
  }
}
