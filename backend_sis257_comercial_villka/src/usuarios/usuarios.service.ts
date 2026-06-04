import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto) {
    const existe = await this.usuariosRepository.findOne({
      where: { usuario: dto.usuario },
    });
    if (existe)
      throw new ConflictException(`El usuario '${dto.usuario}' ya existe`);

    const claveHash = await bcrypt.hash(dto.clave, 10);
    const usuario = this.usuariosRepository.create({
      ...dto,
      clave: claveHash,
    });
    return this.usuariosRepository.save(usuario);
  }

  findAll() {
    return this.usuariosRepository.find({
      select: {
        id: true,
        usuario: true,
        nombre_completo: true,
        email: true,
        activo: true,
        fechaCreacion: true,
      },
    });
  }

  async findOne(id: number) {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
      select: {
        id: true,
        usuario: true,
        nombre_completo: true,
        email: true,
        activo: true,
        fechaCreacion: true,
      },
    });
    if (!usuario)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return usuario;
  }

  async findByUsuario(usuario: string) {
    return this.usuariosRepository.findOne({ where: { usuario } });
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    if (!usuario)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);

    const updateData: Partial<Usuario> = { ...dto };

    if (dto.clave) {
      updateData.clave = await bcrypt.hash(dto.clave, 10);
    }

    Object.assign(usuario, updateData);
    return this.usuariosRepository.save(usuario);
  }

  async remove(id: number) {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    if (!usuario)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return this.usuariosRepository.softDelete(id);
  }
}
