import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
//para anular venta
import { DataSource } from 'typeorm';
import { Llanta } from '../llantas/entities/llanta.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventasRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepository: Repository<DetalleVenta>,

    private readonly dataSource: DataSource,
  ) {}

  create(dto: CreateVentaDto) {
    const total = dto.detalles.reduce((sum, d) => sum + d.subtotal, 0);
    const venta = this.ventasRepository.create({
      cliente_id: dto.cliente_id,
      estado: dto.estado,
      total,
      detalles: dto.detalles.map((d) => ({
        tipo: d.tipo,
        item_id: d.item_id,
        descripcion: d.descripcion,
        precio_unitario: d.precio_unitario,
        cantidad: d.cantidad,
        subtotal: d.subtotal,
      })),
    });
    return this.ventasRepository.save(venta);
  }

  findAll() {
    return this.ventasRepository.find({
      relations: { cliente: true, detalles: true },
    });
  }

  async findOne(id: number) {
    const venta = await this.ventasRepository.findOne({
      where: { id },
      relations: { cliente: true, detalles: true },
    });
    if (!venta) throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    return venta;
  }

  async update(id: number, dto: UpdateVentaDto) {
    const venta = await this.findOne(id);

    if (dto.detalles) {
      await this.detalleVentaRepository.delete({ venta_id: id });

      const nuevosDetalles = dto.detalles.map((d) =>
        this.detalleVentaRepository.create({
          venta_id: id,
          tipo: d.tipo,
          item_id: d.item_id,
          descripcion: d.descripcion,
          precio_unitario: d.precio_unitario,
          cantidad: d.cantidad,
          subtotal: d.subtotal,
        }),
      );

      await this.detalleVentaRepository.save(nuevosDetalles);
      venta.detalles = nuevosDetalles;
    }

    if (dto.cliente_id) venta.cliente_id = dto.cliente_id;
    if (dto.estado) venta.estado = dto.estado;

    venta.total = venta.detalles.reduce(
      (sum, d) => sum + Number(d.subtotal),
      0,
    );

    return this.ventasRepository.save(venta);
  }

  // Método para anular venta
  async anularVenta(id: number) {
    return await this.dataSource.transaction(async (manager) => {
      // Buscar la venta
      const venta = await manager.findOne(Venta, {
        where: { id },
        relations: { detalles: true },
      });
      if (!venta) throw new Error('Venta no encontrada');
      if (venta.estado === 'anulada') throw new Error('Venta ya está anulada');

      // Regenerar stock
      for (const detalle of venta.detalles) {
        if (detalle.tipo === 'llanta') {
          await manager.increment(
            Llanta,
            { id: detalle.item_id },
            'stock',
            detalle.cantidad,
          );
        }
      }

      // Marcar venta como anulada
      venta.estado = 'anulada';
      return await manager.save(Venta, venta);
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.ventasRepository.softDelete(id);
  }
}
