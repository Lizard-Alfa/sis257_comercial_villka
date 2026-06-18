import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { Llanta } from '../llantas/entities/llanta.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventasRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepository: Repository<DetalleVenta>,
    @InjectRepository(Llanta)
    private readonly llantasRepository: Repository<Llanta>,  // ← AGREGAR
    private readonly dataSource: DataSource,
  ) {}

  // DESCUENTO DE STOCK
  async create(dto: CreateVentaDto) {
    return await this.dataSource.transaction(async (manager) => {
      // 1. Descontar stock de las llantas
      for (const detalle of dto.detalles) {
        if (detalle.tipo === 'llanta') {
          const llanta = await manager.findOne(Llanta, { where: { id: detalle.item_id } });
          if (!llanta) throw new Error(`Llanta con ID ${detalle.item_id} no encontrada`);
          if (llanta.stock < detalle.cantidad) {
            throw new Error(`Stock insuficiente para ${llanta.modelo}. Disponible: ${llanta.stock}`);
          }
          await manager.decrement(Llanta, { id: detalle.item_id }, 'stock', detalle.cantidad);
        }
      }

      // 2. Crear la venta
      const total = dto.detalles.reduce((sum, d) => sum + d.subtotal, 0);
      const venta = manager.create(Venta, {
        cliente_id: dto.cliente_id,
        estado: dto.estado || 'activa',
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

      return await manager.save(Venta, venta);
    });
  }

  findAll() {
    return this.ventasRepository.find({
      relations: { cliente: true, detalles: true },
      order: { id: 'DESC' },  // ← AGREGAR: ventas más recientes primero
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
    venta.total = venta.detalles.reduce((sum, d) => sum + Number(d.subtotal), 0);
    return this.ventasRepository.save(venta);
  }

  async anularVenta(id: number) {
    return await this.dataSource.transaction(async (manager) => {
      const venta = await manager.findOne(Venta, {
        where: { id },
        relations: { detalles: true },
      });
      if (!venta) throw new Error('Venta no encontrada');
      if (venta.estado === 'anulada') throw new Error('Venta ya está anulada');

      for (const detalle of venta.detalles) {
        if (detalle.tipo === 'llanta') {
          await manager.increment(Llanta, { id: detalle.item_id }, 'stock', detalle.cantidad);
        }
      }

      venta.estado = 'anulada';
      return await manager.save(Venta, venta);
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.ventasRepository.softDelete(id);
  }
}