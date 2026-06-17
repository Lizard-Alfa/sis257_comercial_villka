import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleCompra } from './entities/detalle-compra.entity';
import { CreateDetalleCompraDto } from './dto/create-detalle-compra.dto';
import { UpdateDetalleCompraDto } from './dto/update-detalle-compra.dto';

@Injectable()
export class DetalleComprasService {
  constructor(
    @InjectRepository(DetalleCompra)
    private readonly repo: Repository<DetalleCompra>,
  ) {}

  create(dto: CreateDetalleCompraDto) {
    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find({ relations: { compra: true, llanta: true } });
  }

  async findOne(id: number) {
    const detalle = await this.repo.findOne({
      where: { id },
      relations: { compra: true, llanta: true },
    });
    if (!detalle)
      throw new NotFoundException(`Detalle con ID ${id} no encontrado`);
    return detalle;
  }

  async update(id: number, dto: UpdateDetalleCompraDto) {
    const detalle = await this.findOne(id);
    Object.assign(detalle, dto);
    return this.repo.save(detalle);
  }

  async remove(id: number) {
    const detalle = await this.findOne(id);
    return this.repo.softRemove(detalle);
  }
}
