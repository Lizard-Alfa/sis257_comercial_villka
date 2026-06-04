import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'admin' })
  @IsDefined({ message: 'El usuario es obligatorio' })
  @IsString()
  @MaxLength(50)
  readonly usuario: string;

  @ApiProperty({ example: '123456' })
  @IsDefined({ message: 'La clave es obligatoria' })
  @IsString()
  @MinLength(6, { message: 'La clave debe tener mínimo 6 caracteres' })
  readonly clave: string;

  @ApiProperty({ example: 'Administrador' })
  @IsDefined({ message: 'El nombre completo es obligatorio' })
  @IsString()
  @MaxLength(100)
  readonly nombre_completo: string;

  @ApiProperty({ example: 'admin@villka.com', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe ser válido' })
  readonly email?: string;
}