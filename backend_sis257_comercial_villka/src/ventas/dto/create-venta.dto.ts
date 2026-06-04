import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

class DetalleDto {
  @IsEnum(['llanta', 'servicio'])
  tipo: 'llanta' | 'servicio';

  @IsInt({ message: 'El ID del item debe ser entero' })
  @Min(1)
  item_id: number;

  @IsString()
  @MaxLength(100)
  descripcion: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio_unitario: number;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  subtotal: number;
}

export class CreateVentaDto {
  @ApiProperty({ example: 1 })
  @IsDefined({ message: 'El cliente es obligatorio' })
  @IsInt({ message: 'El ID del cliente debe ser entero' })
  @Min(1)
  readonly cliente_id: number;

  @ApiProperty({ example: 'pagado' })
  @IsEnum(['pendiente', 'pagado', 'anulado'])
  readonly estado: 'pendiente' | 'pagado' | 'anulado';

  @ApiProperty({ type: [DetalleDto] })
  @IsArray()
  @ArrayMinSize(1, { message: 'Debe haber al menos un detalle' })
  @ValidateNested({ each: true })
  @Type(() => DetalleDto)
  readonly detalles: DetalleDto[];
}
