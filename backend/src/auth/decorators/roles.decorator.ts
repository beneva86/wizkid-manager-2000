import { SetMetadata } from '@nestjs/common';
import { WizkidRole } from 'src/wizkids/wizkid-role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: WizkidRole[]) => SetMetadata(ROLES_KEY, roles);
