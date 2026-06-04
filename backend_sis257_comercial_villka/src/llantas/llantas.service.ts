import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Llanta } from './entities/llanta.entity';
import { CreateLlantaDto } from './dto/create-llanta.dto';
import { UpdateLlantaDto } from './dto/update-llanta.dto';

@Injectable()
export class LlantasService {
  constructor(
    @InjectRepository(Llanta)
    private readonly llantasRepository: Repository<Llanta>,
  ) {}

  create(dto: CreateLlantaDto) {
    return this.llantasRepository.save(dto);
  }

  findAll() {
    return this.llantasRepository.find({ relations: { categoria: true } });
  }

  async findOne(id: number) {
    const llanta = await this.llantasRepository.findOne({
      where: { id },
      relations: { categoria: true },
    });
    if (!llanta)
      throw new NotFoundException(`Llanta con ID ${id} no encontrada`);
    return llanta;
  }

  async update(id: number, dto: UpdateLlantaDto) {
    await this.findOne(id);
    await this.llantasRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.llantasRepository.softDelete(id);
  }
}
