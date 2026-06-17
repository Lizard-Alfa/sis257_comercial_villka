import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProveedorDto {
  @ApiProperty({ example: 'AUTOFAX' })
  @IsDefined()
  @IsString()
  @MaxLength(100)
  readonly nombre: string;

  @ApiPropertyOptional({ example: 'La Paz' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  readonly ciudad?: string;

  @ApiPropertyOptional({ example: 'Carlos López' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly contacto?: string;

  @ApiPropertyOptional({ example: '70012345' })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  readonly telefono?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  readonly condiciones_pago?: string;
}
