import { PartialType } from '@nestjs/swagger';
import { CreateLlantaDto } from './create-llanta.dto';

export class UpdateLlantaDto extends PartialType(CreateLlantaDto) {}
