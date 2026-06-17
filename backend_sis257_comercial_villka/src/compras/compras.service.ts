import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Compra } from './entities/compra.entity';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';

@Injectable()
export class ComprasService {
  constructor(
    @InjectRepository(Compra) private readonly repo: Repository<Compra>,
  ) {}

  create(dto: CreateCompraDto) {
    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find({
      relations: { proveedor: true },
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: number) {
    const compra = await this.repo.findOne({
      where: { id },
      relations: { proveedor: true },
    });
    if (!compra)
      throw new NotFoundException(`Compra con ID ${id} no encontrada`);
    return compra;
  }

  async update(id: number, dto: UpdateCompraDto) {
    const compra = await this.findOne(id);
    Object.assign(compra, dto);
    return this.repo.save(compra);
  }

  async remove(id: number) {
    const compra = await this.findOne(id);
    return this.repo.softRemove(compra);
  }
}
