import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriasRepository: Repository<Categoria>,
  ) {}

  create(dto: CreateCategoriaDto) {
    return this.categoriasRepository.save(dto);
  }

  findAll() {
    return this.categoriasRepository.find();
  }

  async findOne(id: number) {
    const categoria = await this.categoriasRepository.findOne({
      where: { id },
    });
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return categoria;
  }

  async update(id: number, dto: UpdateCategoriaDto) {
    await this.findOne(id);
    await this.categoriasRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.categoriasRepository.softDelete(id);
  }
}
