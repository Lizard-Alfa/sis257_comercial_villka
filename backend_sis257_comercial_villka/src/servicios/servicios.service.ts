import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private readonly serviciosRepository: Repository<Servicio>,
  ) {}

  create(dto: CreateServicioDto) {
    return this.serviciosRepository.save(dto);
  }

  findAll() {
    return this.serviciosRepository.find();
  }

  async findOne(id: number) {
    const servicio = await this.serviciosRepository.findOne({ where: { id } });
    if (!servicio) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }
    return servicio;
  }

  async update(id: number, dto: UpdateServicioDto) {
    await this.findOne(id);
    await this.serviciosRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.serviciosRepository.softDelete(id);
  }
}
