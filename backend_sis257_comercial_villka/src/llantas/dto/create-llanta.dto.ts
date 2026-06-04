import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateLlantaDto {
  @ApiProperty({ example: 'MIC-PRIM4' })
  @IsDefined({ message: 'El código es obligatorio' })
  @IsString({ message: 'El código debe ser texto' })
  @MaxLength(50, { message: 'Máximo 50 caracteres' })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly codigo: string;

  @ApiProperty({ example: 'MICHELIN' })
  @IsDefined({ message: 'La marca es obligatoria' })
  @IsString({ message: 'La marca debe ser texto' })
  @MaxLength(100, { message: 'Máximo 100 caracteres' })
  readonly marca: string;

  @ApiProperty({ example: 'PRIMACY 4' })
  @IsDefined({ message: 'El modelo es obligatorio' })
  @IsString({ message: 'El modelo debe ser texto' })
  @MaxLength(100, { message: 'Máximo 100 caracteres' })
  readonly modelo: string;

  @ApiProperty({ example: '205/55R16' })
  @IsDefined({ message: 'La medida es obligatoria' })
  @IsString({ message: 'La medida debe ser texto' })
  @MaxLength(50, { message: 'Máximo 50 caracteres' })
  readonly medida: string;

  @ApiProperty({ example: 45000 })
  @IsDefined({ message: 'El precio es obligatorio' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser numérico' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  readonly precio: number;

  @ApiProperty({ example: 10 })
  @IsDefined({ message: 'El stock es obligatorio' })
  @IsInt({ message: 'El stock debe ser entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  readonly stock: number;

  @ApiProperty({ example: 'https://ejemplo.com/llanta.jpg', required: false })
  @IsOptional()
  @IsString({ message: 'La URL debe ser texto' })
  @MaxLength(255, { message: 'Máximo 255 caracteres' })
  readonly imagen_url?: string;

  @ApiProperty({ example: 1 })
  @IsDefined({ message: 'La categoría es obligatoria' })
  @IsInt({ message: 'El ID de categoría debe ser entero' })
  @Min(1, { message: 'El ID de categoría debe ser mayor a 0' })
  readonly categoria_id: number;
}
