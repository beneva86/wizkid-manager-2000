import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { WizkidsService } from '../wizkids/wizkids.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(WizkidsService.name);

  constructor(
    private readonly wizkidsService: WizkidsService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(email: string, password: string) {
    this.logger.log(`AuthService Login attempt for ${email}`);

    const wizkid = await this.wizkidsService.findByEmail(email);

    if (!wizkid) {
      this.logger.warn(`AuthServiceLogin failed: user not found (${email})`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // no password provided
    if (!wizkid.passwordHash) {
      this.logger.warn(
        `AuthService Login failed: no password provided (${email})`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    // user is fired
    if (wizkid.firedAt) {
      this.logger.warn(`AuthService Login blocked: fired user (${email})`);
      throw new UnauthorizedException('Account is disabled');
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      wizkid.passwordHash,
    );
    if (!isPasswordCorrect) {
      this.logger.warn(`AuthService Login failed: wrong password (${email})`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const secret = this.config.get<string>('JWT_SECRET');
    if (!secret) throw new Error('JWT_SECRET is not set');

    const accessToken = await this.jwtService.signAsync(
      { sub: wizkid._id.toString(), role: wizkid.role },
      { secret },
    );

    this.logger.log(`AuthServiceLogin success for ${email}`);

    return { accessToken };
  }
}
