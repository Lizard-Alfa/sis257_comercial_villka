import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Modelo } from './entities/modelo.entity';
import { CreateModeloDto } from './dto/create-modelo.dto';
import { UpdateModeloDto } from './dto/update-modelo.dto';

@Injectable()
export class ModelosService {
  constructor(
    @InjectRepository(Modelo)
    private readonly modelosRepository: Repository<Modelo>,
  ) {}

  async create(dto: CreateModeloDto) {
    const modelo = this.modelosRepository.create(dto);
    return this.modelosRepository.save(modelo);
  }

  findAll() {
    return this.modelosRepository.find({
      relations: { marca: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number) {
    const modelo = await this.modelosRepository.findOne({
      where: { id },
      relations: { marca: true },
    });
    if (!modelo)
      throw new NotFoundException(`Modelo con ID ${id} no encontrado`);
    return modelo;
  }

  async update(id: number, dto: UpdateModeloDto) {
    const modelo = await this.findOne(id);
    Object.assign(modelo, dto);
    return this.modelosRepository.save(modelo);
  }

  async remove(id: number) {
    const modelo = await this.findOne(id);
    return this.modelosRepository.softRemove(modelo);
  }
}
