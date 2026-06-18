import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
// Entidades existentes
import { Categoria } from './categorias/entities/categoria.entity';
import { Servicio } from './servicios/entities/servicio.entity';
import { Cliente } from './clientes/entities/cliente.entity';
import { Llanta } from './llantas/entities/llanta.entity';
import { Venta } from './ventas/entities/venta.entity';
import { DetalleVenta } from './ventas/entities/detalle-venta.entity';
import { Usuario } from './usuarios/entities/usuario.entity';
// NUEVAS Entidades
import { Marca } from './marcas/entities/marca.entity';
import { Modelo } from './modelos/entities/modelo.entity';
import { Proveedor } from './proveedores/entities/proveedor.entity';
import { Compra } from './compras/entities/compra.entity';
import { DetalleCompra } from './detalle-compras/entities/detalle-compra.entity';
// Módulos
import { CategoriasModule } from './categorias/categorias.module';
import { ServiciosModule } from './servicios/servicios.module';
import { ClientesModule } from './clientes/clientes.module';
import { LlantasModule } from './llantas/llantas.module';
import { VentasModule } from './ventas/ventas.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { ComprasModule } from './compras/compras.module';
import { MarcasModule } from './marcas/marcas.module';
import { ModelosModule } from './modelos/modelos.module';
import { DetalleComprasModule } from './detalle-compras/detalle-compras.module';

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
        // ENTIDADES NUEVAS
        Marca,
        Modelo,
        Proveedor,
        Compra,
        DetalleCompra,
      ],
      synchronize: false, // Para evitar Errores
    }),
    CategoriasModule,
    ServiciosModule,
    ClientesModule,
    LlantasModule,
    VentasModule,
    UsuariosModule,
    AuthModule,
    // NUEVOS MODULES
    ProveedoresModule,
    ComprasModule,
    MarcasModule,
    ModelosModule,
    DetalleComprasModule,
  ],
})
export class AppModule {}
