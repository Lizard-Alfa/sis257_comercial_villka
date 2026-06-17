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
    return this.llantasRepository.save(this.llantasRepository.create(dto));
  }

  findAll() {
    return this.llantasRepository.find({ relations: { marca: true } });
  }

  async findOne(id: number) {
    const llanta = await this.llantasRepository.findOne({
      where: { id },
      relations: { marca: true },
    });
    if (!llanta)
      throw new NotFoundException(`Llanta con ID ${id} no encontrada`);
    return llanta;
  }

  async update(id: number, dto: UpdateLlantaDto) {
    const llanta = await this.findOne(id);
    Object.assign(llanta, dto);
    return this.llantasRepository.save(llanta);
  }

  async remove(id: number) {
    const llanta = await this.findOne(id);
    return this.llantasRepository.softRemove(llanta);
  }
}
