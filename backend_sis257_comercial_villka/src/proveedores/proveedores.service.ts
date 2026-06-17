import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor) private readonly repo: Repository<Proveedor>,
  ) {}

  create(dto: CreateProveedorDto) {
    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number) {
    const proveedor = await this.repo.findOne({
      where: { id },
      relations: { compras: true },
    });
    if (!proveedor)
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    return proveedor;
  }

  async update(id: number, dto: UpdateProveedorDto) {
    const proveedor = await this.findOne(id);
    Object.assign(proveedor, dto);
    return this.repo.save(proveedor);
  }

  async remove(id: number) {
    const proveedor = await this.findOne(id);
    return this.repo.softRemove(proveedor);
  }
}
