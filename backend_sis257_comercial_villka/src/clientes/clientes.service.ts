import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clientesRepository: Repository<Cliente>,
  ) {}

  async create(dto: CreateClienteDto) {
    const existe = await this.clientesRepository.findOne({
      where: { ci_nit: dto.ci_nit },
    });
    if (existe) {
      throw new ConflictException(
        `Ya existe un cliente con CI/NIT: ${dto.ci_nit}`,
      );
    }

    const cliente = this.clientesRepository.create(dto);
    return this.clientesRepository.save(cliente);
  }

  findAll() {
    return this.clientesRepository.find();
  }

  async findOne(id: number) {
    const cliente = await this.clientesRepository.findOne({ where: { id } });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }

  async update(id: number, dto: UpdateClienteDto) {
    await this.findOne(id);
    await this.clientesRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.clientesRepository.softDelete(id);
  }

  async buscar(query: string) {
    if (!query || query.length < 2) return [];
    return this.clientesRepository
      .createQueryBuilder('cliente')
      .where('LOWER(cliente.nombre) LIKE LOWER(:q)', { q: `%${query}%` })
      .orWhere('cliente.telefono LIKE :q', { q: `%${query}%` })
      .orWhere('cliente.nit LIKE :q', { q: `%${query}%` })
      .take(10)
      .getMany();
  }
}
