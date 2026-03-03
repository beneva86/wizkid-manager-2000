import { IsEnum, IsOptional, IsString } from 'class-validator';
import { WizkidRole } from '../wizkid-role.enum';

export class ListWizkidsQuery {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(WizkidRole)
  role?: WizkidRole;
}
