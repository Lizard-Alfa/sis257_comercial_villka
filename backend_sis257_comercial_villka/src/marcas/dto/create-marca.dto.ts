import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, MaxLength } from 'class-validator';

export class CreateMarcaDto {
  @ApiProperty({ example: 'Michelin' })
  @IsDefined({ message: 'El nombre es obligatorio' })
  @IsString()
  @MaxLength(50)
  readonly nombre: string;
}
