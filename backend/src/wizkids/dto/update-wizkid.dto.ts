import { PartialType } from '@nestjs/mapped-types';
import { CreateWizkidDto } from './create-wizkid.dto';

export class UpdateWizkidDto extends PartialType(CreateWizkidDto) {}
