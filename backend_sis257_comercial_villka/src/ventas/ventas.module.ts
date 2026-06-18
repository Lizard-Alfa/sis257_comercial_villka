import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { Llanta } from '../llantas/entities/llanta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, DetalleVenta, Llanta]),
  ],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}