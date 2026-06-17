import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber } from 'class-validator';

export class CreateDetalleCompraDto {
  @ApiProperty({ example: 1 })
  @IsDefined()
  @IsNumber()
  readonly compra_id: number;

  @ApiProperty({ example: 1 })
  @IsDefined()
  @IsNumber()
  readonly llanta_id: number;

  @ApiProperty({ example: 10 })
  @IsDefined()
  @IsNumber()
  readonly cantidad: number;

  @ApiProperty({ example: 450.0 })
  @IsDefined()
  @IsNumber()
  readonly precio_unitario: number;

  @ApiProperty({ example: 4500.0 })
  @IsDefined()
  @IsNumber()
  readonly subtotal: number;
}
