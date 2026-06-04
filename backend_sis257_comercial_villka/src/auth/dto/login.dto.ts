import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin' })
  @IsDefined({ message: 'El usuario es obligatorio' })
  @IsString()
  readonly usuario: string;

  @ApiProperty({ example: '123456' })
  @IsDefined({ message: 'La clave es obligatoria' })
  @IsString()
  readonly clave: string;
}
