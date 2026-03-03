import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WizkidsModule } from '../wizkids/wizkids.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, WizkidsModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
