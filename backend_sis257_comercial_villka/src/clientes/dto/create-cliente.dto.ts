import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, Matches, MaxLength } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({ example: '1234567', description: 'CI o NIT del cliente' })
  @IsDefined({ message: 'El CI/NIT es obligatorio' })
  @IsString()
  @Matches(/^[0-9]{5,10}(-[0-9]{1,3})?$/, {
    message: 'Formato inválido. Ej: 1234567 o 1234567890-1',
  })
  readonly ci_nit: string;

  @ApiProperty({ example: 'Juan Pérez López' })
  @IsDefined({ message: 'El nombre completo es obligatorio' })
  @IsString()
  @MaxLength(100)
  readonly nombre_completo: string;

  @ApiProperty({ example: '70012345' })
  @IsDefined({ message: 'El teléfono es obligatorio' })
  @IsString()
  @Matches(/^[0-9]{7,8}$/, { message: 'El teléfono debe tener 7 u 8 dígitos' })
  readonly telefono: string;
}
