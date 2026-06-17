import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCompraDto {
  @ApiProperty({ example: 1 })
  @IsDefined()
  @IsNumber()
  readonly proveedor_id: number;

  @ApiPropertyOptional({ example: '2026-06-17' })
  @IsOptional()
  @IsString()
  readonly fecha?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  readonly total?: number;

  @ApiPropertyOptional({ example: 'pendiente' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  readonly estado?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly observaciones?: string;
}
