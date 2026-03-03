import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { WizkidRole } from '../wizkid-role.enum';

export class CreateWizkidDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEnum(WizkidRole)
  role: WizkidRole;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  // Optional for now: allows creating wizkids without login access yet
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
