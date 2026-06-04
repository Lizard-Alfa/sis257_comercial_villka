import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Categoria } from './categorias/entities/categoria.entity';
import { Servicio } from './servicios/entities/servicio.entity';
import { Cliente } from './clientes/entities/cliente.entity';
import { Llanta } from './llantas/entities/llanta.entity';
import { CategoriasModule } from './categorias/categorias.module';
import { ServiciosModule } from './servicios/servicios.module';
import { ClientesModule } from './clientes/clientes.module';
import { LlantasModule } from './llantas/llantas.module';
import { Venta } from './ventas/entities/venta.entity';
import { DetalleVenta } from './ventas/entities/detalle-venta.entity';
import { VentasModule } from './ventas/ventas.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { Usuario } from './usuarios/entities/usuario.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: String(process.env.DB_PASSWORD),
      database: process.env.DB_NAME,
      entities: [
        Categoria,
        Servicio,
        Cliente,
        Llanta,
        Venta,
        DetalleVenta,
        Usuario,
      ],
      synchronize: true,
    }),
    CategoriasModule,
    ServiciosModule,
    ClientesModule,
    LlantasModule,
    VentasModule,
    UsuariosModule,
    AuthModule,
  ],
})
export class AppModule {}
