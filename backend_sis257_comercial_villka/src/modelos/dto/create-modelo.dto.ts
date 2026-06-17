import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateModeloDto {
  @ApiProperty({ example: 'Primacy 4' })
  @IsDefined({ message: 'El nombre es obligatorio' })
  @IsString()
  @MaxLength(100)
  readonly nombre: string;

  @ApiProperty({ example: 1 })
  @IsDefined({ message: 'La marca es obligatoria' })
  @IsNumber()
  readonly marca_id: number;
}
