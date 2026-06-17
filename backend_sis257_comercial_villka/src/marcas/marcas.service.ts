import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marca } from './entities/marca.entity';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';

@Injectable()
export class MarcasService {
  constructor(
    @InjectRepository(Marca)
    private readonly marcasRepository: Repository<Marca>,
  ) {}

  async create(dto: CreateMarcaDto) {
    const existe = await this.marcasRepository.findOne({
      where: { nombre: dto.nombre },
    });
    if (existe)
      throw new ConflictException(`La marca '${dto.nombre}' ya existe`);
    const marca = this.marcasRepository.create(dto);
    return this.marcasRepository.save(marca);
  }

  findAll() {
    return this.marcasRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number) {
    const marca = await this.marcasRepository.findOne({ where: { id } });
    if (!marca) throw new NotFoundException(`Marca con ID ${id} no encontrada`);
    return marca;
  }

  async update(id: number, dto: UpdateMarcaDto) {
    const marca = await this.findOne(id);
    if (dto.nombre && dto.nombre !== marca.nombre) {
      const existe = await this.marcasRepository.findOne({
        where: { nombre: dto.nombre },
      });
      if (existe)
        throw new ConflictException(`La marca '${dto.nombre}' ya existe`);
    }
    Object.assign(marca, dto);
    return this.marcasRepository.save(marca);
  }

  async remove(id: number) {
    const marca = await this.findOne(id);
    return this.marcasRepository.softRemove(marca);
  }
}
