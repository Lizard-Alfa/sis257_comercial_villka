import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleCompra } from './entities/detalle-compra.entity';
import { DetalleComprasService } from './detalle-compras.service';
import { DetalleComprasController } from './detalle-compras.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleCompra])],
  controllers: [DetalleComprasController],
  providers: [DetalleComprasService],
  exports: [DetalleComprasService],
})
export class DetalleComprasModule {}
