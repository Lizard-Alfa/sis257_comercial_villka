import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.usuariosService.findByUsuario(dto.usuario);
    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

    const claveValida = await bcrypt.compare(dto.clave, usuario.clave);
    if (!claveValida) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: usuario.id, usuario: usuario.usuario };
    return {
      access_token: this.jwtService.sign(payload),
      usuario: usuario.usuario,
      nombre_completo: usuario.nombre_completo,
    };
  }
}
